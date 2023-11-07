using System.Security;
using API.Data;
using API.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class SeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebHostEnvironment _env;

    public SeedController(
        ApplicationDbContext context,
        RoleManager<IdentityRole> roleManager,
        UserManager<ApplicationUser> userManager,
        IWebHostEnvironment env)
    {
        _context = context;
        _roleManager = roleManager;
        _userManager = userManager;
        _env = env;
    }

    [HttpGet]
    public async Task<ActionResult> Import()
    {
        // prevents non-development environments from running this method
        if (!_env.IsDevelopment())
            throw new SecurityException("Not allowed");

        var path = Path.Combine(_env.ContentRootPath, "Data/Source/worldcities.xlsx");

        using var stream = System.IO.File.OpenRead(path);
        using var excelPackage = new ExcelPackage(stream);

        // get the first worksheet 
        var worksheet = excelPackage.Workbook.Worksheets[0];

        // define how many rows we want to process
        var nEndRow = worksheet.Dimension.End.Row;

        // initialize the record counters
        var numberOfCountriesAdded = 0;
        var numberOfCitiesAdded = 0;

        // create a lookup dictionary
        // containing all the countries already existing
        // into the Database (it will be empty on first run).
        var countriesByName = _context.Countries
            .AsNoTracking()
            .ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

        // iterates through all rows, skipping the first one 
        for (int nRow = 2; nRow < nEndRow; nRow++)
        {
            var row = worksheet.Cells[nRow, 1, nRow, worksheet.Dimension.End.Column];

            var countryName = row[nRow, 5].GetValue<string>();
            var iso2 = row[nRow, 6].GetValue<string>();
            var iso3 = row[nRow, 7].GetValue<string>();

            // skip this country if it already exists in the database
            if (countriesByName.ContainsKey(countryName))
                continue;

            // create the Country entity and fill it with xlsx data
            var country = new Country
            {
                Name = countryName,
                ISO2 = iso2,
                ISO3 = iso3
            };

            // add the new country to the DB context
            await _context.Countries.AddAsync(country);

            // store the country in our lookup to retrieve its Id later on
            countriesByName.Add(countryName, country);

            // increment the counter
            numberOfCountriesAdded++;
        }

        // save all the countries into the Database
        if (numberOfCountriesAdded > 0)
            await _context.SaveChangesAsync();


        // create a lookup dictionary
        // containing all the cities already existing
        // into the Database (it will be empty on first run).
        var cities = _context.Cities
            .AsNoTracking()
            .ToDictionary(x => (
                Name: x.Name,
                Lat: x.Lat,
                Lon: x.Lon,
                CountryId: x.CountryId));

        // iterates through all rows, skipping the first one
        for (int nRow = 2; nRow <= nEndRow; nRow++)
        {
            var row = worksheet.Cells[
                nRow, 1, nRow, worksheet.Dimension.End.Column];
            var name = row[nRow, 1].GetValue<string>();
            var nameAscii = row[nRow, 2].GetValue<string>();
            var lat = row[nRow, 3].GetValue<decimal>();
            var lon = row[nRow, 4].GetValue<decimal>();
            var countryName = row[nRow, 5].GetValue<string>();

            // retrieve country Id by countryName
            var countryId = countriesByName[countryName].Id;

            // skip this city if it already exists in the database
            if (cities.ContainsKey((
                    Name: name,
                    Lat: lat,
                    Lon: lon,
                    CountryId: countryId)))
                continue;

            // create the City entity and fill it with xlsx data
            var city = new City
            {
                Name = name,
                Name_ASCII = nameAscii,
                Lat = lat,
                Lon = lon,
                CountryId = countryId
            };

            // add the new city to the DB context
            _context.Cities.Add(city);

            // increment the counter
            numberOfCitiesAdded++;
        }

        // save all the cities into the Database
        if (numberOfCitiesAdded > 0)
            await _context.SaveChangesAsync();

        return new JsonResult(new
        {
            Cities = numberOfCitiesAdded,
            Countries = numberOfCountriesAdded
        });
    }

    [HttpGet]
    public async Task<ActionResult> CreateDefaultUsers()
    {
        // setup the default role names
        string roleRegisteredUser = "RegisteredUser";
        string roleAdministrator = "Administrator";

        // create the default roles (if they don't exist yet)
        if (await _roleManager.FindByNameAsync(roleRegisteredUser) == null)
        {
            await _roleManager.CreateAsync(new IdentityRole(roleRegisteredUser));
        }
        if (await _roleManager.FindByNameAsync(roleAdministrator) == null)
        {
            await _roleManager.CreateAsync(new IdentityRole(roleAdministrator));
        }

        // create a list to track the newly added users
        var addedUserList = new List<ApplicationUser>();

        // check if the admin user already exists
        var emailAdmin = "admin@email.com";
        if (await _userManager.FindByNameAsync(emailAdmin) == null)
        {
            // create a new admin ApplicationUser account
            var userAdmin = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = emailAdmin,
                Email = emailAdmin
            };

            // insert the admin user into the DB
            await _userManager.CreateAsync(userAdmin, "Pa$$w0rd");

            // assign the "RegisteredUser" and "Administrator" roles
            await _userManager.AddToRoleAsync(userAdmin, roleRegisteredUser);
            await _userManager.AddToRoleAsync(userAdmin, roleAdministrator);

            // confirm the e-mail and remove lockout
            userAdmin.EmailConfirmed = true;
            userAdmin.LockoutEnabled = false;

            // add the admin user to the added users list
            addedUserList.Add(userAdmin);
        }

        // check if the standard user user already exists
        var emailUser = "user@email.com";
        if (await _userManager.FindByNameAsync(emailUser) == null)
        {
            // create a new standard user ApplicationUser account
            var userUser = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = emailUser,
                Email = emailUser
            };

            // insert the standard user user into the DB
            await _userManager.CreateAsync(userUser, "Pa$$w0rd");

            // assign the "RegisteredUser" role
            await _userManager.AddToRoleAsync(userUser, roleRegisteredUser);

            // confirm the e-mail and remove lockout
            userUser.EmailConfirmed = true;
            userUser.LockoutEnabled = false;

            // add the standard user user to the added users list
            addedUserList.Add(userUser);
        }

        // if we added at least one user, persist the changes into the DB
        if (addedUserList.Any())
        {
            await _context.SaveChangesAsync();
        }

        return new JsonResult(new
        {
            Count = addedUserList.Count,
            Users = addedUserList
        });
    }
    
}