using System.Text.Json.Serialization;

namespace API.Data.Dto;

public class CountryDto
{
    public int Id { get; set; }

    public string Name { get; set; }
    
    [JsonPropertyName("iso2")]
    public string ISO2 { get; set; }
    
    [JsonPropertyName("iso3")]
    public string ISO3 { get; set; }

    public int TotalCities { get; set; }
}