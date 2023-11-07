using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace API.Test;

public static class IdentityHelper
{
    public static RoleManager<TIdentityRole>
        GetRoleManager<TIdentityRole>(IRoleStore<TIdentityRole> roleStore)
        where TIdentityRole : IdentityRole
    {
        return new RoleManager<TIdentityRole>(
            roleStore,
            Array.Empty<IRoleValidator<TIdentityRole>>(),
            new UpperInvariantLookupNormalizer(),
            new Mock<IdentityErrorDescriber>().Object,
            new Mock<ILogger<RoleManager<TIdentityRole>>>(
            ).Object);
    }

    public static UserManager<TIDentityUser>
        GetUserManager<TIDentityUser>(IUserStore<TIDentityUser> userStore)
        where TIDentityUser : IdentityUser
    {
        return new UserManager<TIDentityUser>(
            userStore,
            new Mock<IOptions<IdentityOptions>>().Object,
            new Mock<IPasswordHasher<TIDentityUser>>().Object,
            Array.Empty<IUserValidator<TIDentityUser>>(),
            Array.Empty<IPasswordValidator<TIDentityUser>>(),
            new UpperInvariantLookupNormalizer(),
            new Mock<IdentityErrorDescriber>().Object,
            new Mock<IServiceProvider>().Object,
            new Mock<ILogger<UserManager<TIDentityUser>>>(
            ).Object);
    }
}