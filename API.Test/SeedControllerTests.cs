using API.Controllers;
using API.Data;
using API.Data.Models;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
            var roleStore = new RoleStore<IdentityRole>(context);
            var roleManager = new RoleManager<IdentityRole>(
                roleStore, Array.Empty<IRoleValidator<IdentityRole>>(),
                new UpperInvariantLookupNormalizer(),
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<ILogger<RoleManager<IdentityRole>>>().Object
            );

            // create a UserManager instance
            var userStore = new
                UserStore<ApplicationUser>(context);
            var userManager = new UserManager<ApplicationUser>(
                userStore,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<ApplicationUser>>().Object,
                Array.Empty<IUserValidator<ApplicationUser>>(),
                Array.Empty<IPasswordValidator<ApplicationUser>>(),
                new UpperInvariantLookupNormalizer(),
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<ApplicationUser>>>(
                ).Object);

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