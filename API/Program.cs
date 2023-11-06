using Serilog;
using Serilog.Events;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json",
                    optional: false,
                    reloadOnChange: true)
                .AddJsonFile(string.Format("appsettings.{0}.json",
                        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") 
                        ?? "Production"),
                    optional: true,
                    reloadOnChange: true)
                .AddUserSecrets<Startup>(optional: true, reloadOnChange: true)
                .Build();
            
            Log.Logger = new LoggerConfiguration()
                // .WriteTo.PostgreSQL(
                //     connectionString: configuration.GetConnectionString("DefaultConnection"),
                //     tableName: "LogEvents",
                //     restrictedToMinimumLevel: LogEventLevel.Information,
                //     needAutoCreateTable: true)
                .WriteTo.Console()
                .CreateLogger();
            
            CreateHostBuilder(args)
                .UseSerilog()
                .Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}