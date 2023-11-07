using API.Controllers;
using API.Data;
using API.Data.Models;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;

namespace API.Test;

public class SeedControllerTests
{
    /// <summary>
    /// Test the CreateDefaultUsers() method
    /// </summary>
    [Fact]
    public async void CreateDefaultUsers()
    {
        #region Arrange

        var options = new DbContextOptionsBuilder()
            .UseInMemoryDatabase(databaseName: "world_cities")
            .Options;
        var storeOptions = Options.Create(new OperationalStoreOptions());

        // create a IWebHost environment mock instance
        var mockEnv = new Mock<IWebHostEnvironment>().Object;

        ApplicationUser userAdmin = null;
        ApplicationUser userUser = null;
        ApplicationUser userNotExisiting = null;

        #endregion

        #region Act

        using (var context = new ApplicationDbContext(options, storeOptions))
        {
            // create a RoleManager instance
            var roleManager = IdentityHelper.GetRoleManager(
                    new RoleStore<IdentityRole>(context));

            // create a UserManager instance
            var userManager = IdentityHelper.GetUserManager(
                new UserStore<ApplicationUser>(context));

            // create a SeedController instance
            var controller = new SeedController(
                context,
                roleManager,
                userManager,
                mockEnv
            );

            // execute the SeedController's CreateDefaultUsers()
            // method to create the default users (and roles)
            await controller.CreateDefaultUsers();

            // retrieve the users
            userAdmin = await userManager.FindByEmailAsync("admin@email.com");
            userUser = await userManager.FindByEmailAsync("user@email.com");
            userNotExisiting = await userManager.FindByEmailAsync("notexisting@email.com");
        }

        #endregion

        #region Assert

        Assert.NotNull(userAdmin);
        Assert.NotNull(userUser);
        Assert.Null(userNotExisiting);

        #endregion
    }
}