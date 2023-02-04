/**
* Modified SPT-AKI build script, adjusted for Terragroup Knight
* Original by waffle.lord
* https://dev.sp-tarkov.com/SPT-AKI/Modules/src/branch/development/project/build.cake
*/

string target = Argument<string>("target", "ExecuteBuild");
bool VSBuilt = Argument<bool>("vsbuilt", false);

#addin nuget:?package=Cake.FileHelpers&version=5.0.0

// Cake API Reference: https://cakebuild.net/dsl/
// Setup variables
var buildDir = "./Build";
var delPaths = GetDirectories("./**/*(obj|bin)");
var bepInExPluginsFolder = string.Format("{0}/{1}/{2}", buildDir, "BepInEx", "plugins");
var bepInExPatchersFolder = string.Format("{0}/{1}/{2}", buildDir, "BepInEx", "patchers");
var solutionPath = "./TerragroupKnightPlugins.sln";

Setup(context => 
{
    // Building from VS will lock the files and fail to clean the project directories. Post-Build event on TGK.Preloader sets this switch to true to avoid this.
    FileWriteText("./vslock", "lock");
});

Teardown(context => 
{
    if(FileExists("./vslock")) 
    {
        DeleteFile("./vslock"); // Remove vslock file
    }    
});

// Clean build directory and remove obj / bin folder from projects
Task("Clean")
    .WithCriteria(!VSBuilt)
    .Does(() => 
    {
        CleanDirectory(buildDir);
    })
    .DoesForEach(delPaths, (directoryPath) => 
    {
        DeleteDirectory(directoryPath, new DeleteDirectorySettings 
        {
            Recursive = true,
            Force = true
        });
    });

// Build solution
Task("Build")
    .IsDependentOn("Clean")
    .WithCriteria(!FileExists("./vslock")) // check for lock file if running from VS
    .Does(() => 
    {
        DotNetBuild(solutionPath, new DotNetBuildSettings
        {
            Configuration = "Release"
        });
    });

// Copy modules, managed dlls, and license to the build folder
Task("CopyBuildData")
    .IsDependentOn("Build")
    .Does(() =>
    {
        CleanDirectory(buildDir);
        CreateDirectory(bepInExPluginsFolder);
		CreateDirectory(bepInExPatchersFolder);
    })
    .DoesForEach(GetFiles("./TGK.*/bin/Release/net472/*.dll"), (dllPath) => //copy plugins 
    {
		if (dllPath.GetFilename().ToString().Equals("TGK.Preloader.dll"))
        {
            //Incase you want to see what is being copied for debuging
            Spectre.Console.AnsiConsole.WriteLine(string.Format("Adding preloader patcher: {0}", dllPath.GetFilename()));

            string patcherTransferPath = string.Format("{0}/{1}", bepInExPatchersFolder, dllPath.GetFilename());

            CopyFile(dllPath, patcherTransferPath);
        }

        if(dllPath.GetFilename().ToString().Equals("TGK.Runtime.dll")) 
        {
            //Incase you want to see what is being copied for debuging
            Spectre.Console.AnsiConsole.WriteLine(string.Format("Adding plugin: {0}", dllPath.GetFilename()));
        
            string moduleTransferPath = string.Format("{0}/{1}", bepInExPluginsFolder, dllPath.GetFilename());
        
            CopyFile(dllPath, moduleTransferPath);
        }
    });

// Runs all build tasks based on dependency and configuration
Task("ExecuteBuild")
    .IsDependentOn("CopyBuildData");

// Runs target task
RunTarget(target);