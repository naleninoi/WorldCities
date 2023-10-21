using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }
    
    public DbSet<City> Cities { get; set; }
    
    public DbSet<Country> Countries { get; set; }

}