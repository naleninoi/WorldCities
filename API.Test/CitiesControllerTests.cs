using API.Controllers;
using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Test;

public class CitiesControllerTests
{
    /// <summary>
    /// Test the GetCity() method
    /// </summary>
    [Fact]
    public async void GetCity()
    {
        #region Arrange
        var options = new DbContextOptionsBuilder()
            .UseInMemoryDatabase(databaseName: "world_cities")
            .Options;
        using (var context = new ApplicationDbContext(options))
        {
            context.Add(new City
            {
                Id = 1,
                CountryId = 1,
                Lat = 100,
                Lon = 99,
                Name = "Test City",
                Name_ASCII = "Test City"
            });
            await context.SaveChangesAsync();
        }

        City existingCity = null;
        City notExistingCity = null;
        #endregion

        #region Act
        using (var context = new ApplicationDbContext(options))
        {
            var controller = new CitiesController(context);
            existingCity = (await controller.GetCity(1)).Value;
            notExistingCity = (await controller.GetCity(2)).Value;
        }
        #endregion

        #region Assert
        Assert.NotNull(existingCity);
        Assert.Null(notExistingCity);
        #endregion
    }
}