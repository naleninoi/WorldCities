using API.Data;
using API.Data.Dto;
using API.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CitiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CitiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Cities
    // GET: api/Cities/?pageIndex=0&pageSize=10
    [HttpGet]
    public async Task<ActionResult<ApiResult<CityDto>>> GetCities(
        int pageIndex = 0,
        int pageSize = 10,
        string sortColumn = null,
        string sortOrder = null,
        string filterColumn = null,
        string filterQuery = null)
    {
        return await ApiResult<CityDto>.CreateAsync(
            _context.Cities.Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name,
                Name_ASCII = c.Name_ASCII,
                Lat = c.Lat,
                Lon = c.Lon,
                CountryId = c.CountryId,
                CountryName = c.Country.Name
            }),
            pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery);
    }

    // GET: api/Cities/5
    [HttpGet("{id}")]
    public async Task<ActionResult<City>> GetCity(int id)
    {
        var city = await _context.Cities.FindAsync(id);
        if (city == null)
        {
            return NotFound();
        }

        return city;
    }

    // PUT: api/Cities/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCity(int id, City city)
    {
        if (id != city.Id)
        {
            return BadRequest();
        }

        _context.Entry(city).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CityExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Cities
    [HttpPost]
    public async Task<ActionResult<City>> PostCity(City city)
    {
        city.Name_ASCII = city.Name;
        _context.Cities.Add(city);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetCity", new { id = city.Id },
            city);
    }

    // DELETE: api/Cities/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<City>> DeleteCity(int id)
    {
        var city = await _context.Cities.FindAsync(id);
        if (city == null)
        {
            return NotFound();
        }

        _context.Cities.Remove(city);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    [Route("IsDupeCity")]
    public bool IsDupeCity(City testCity)
    {
        return _context.Cities.Any(c => c.Name == testCity.Name
                                        && c.Lat == testCity.Lat
                                        && c.Lon == testCity.Lon
                                        && c.CountryId == testCity.CountryId
                                        && c.Id != testCity.Id);
    }

    private bool CityExists(int id)
    {
        return _context.Cities.Any(e => e.Id == id);
    }
}