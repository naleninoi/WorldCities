﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Data.Models;

[Table("Countries")]
public class Country
{
    /// <summary>
    /// The unique id and primary key for this Country
    /// </summary>
    [Key]
    [Required]
    public int Id { get; set; }
    
    /// <summary>
    /// Country name (in UTF8 format)
    /// </summary>
    public string Name { get; set; }
    
    /// <summary>
    /// Country code (in ISO 3166-1 ALPHA-2 format)
    /// </summary>
    [JsonPropertyName("iso2")]
    public string ISO2 { get; set; }
    
    /// <summary>
    /// Country code (in ISO 3166-1 ALPHA-3 format)
    /// </summary>
    [JsonPropertyName("iso3")]
    public string ISO3 { get; set; }
    
    /// <summary>
    /// A list containing all the cities related to this country.
    /// </summary>
    public virtual List<City> Cities { get; set; }
}