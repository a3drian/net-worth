const { writeFileSync, renameSync } = require("fs");
const { execSync } = require("child_process");

(function build() {
    const [semver = process.env.SEMVER] = process.argv.splice(2);

    // transpile
    execSync("npm run compile", { stdio: "inherit" });

    // add dist package.json
    const distPackageJsonPath = "bin/package.json";
    writeFileSync(distPackageJsonPath, JSON.stringify({
        ...require("./package.json"),
        ...(semver ? { version: semver } : {}),
        scripts: undefined,
        devDependencies: undefined
    }, null, 4), { encoding: "utf-8" });
    console.log(`FILE: ${distPackageJsonPath}`);

    // pack and save new integrity
    const result = JSON.parse(execSync(`npm pack --json`, { cwd: "bin" }).toString())[0];
    const tgzPath = `bin/${result.filename.replace(/^\@/, "").replace(/\//g, "-")}`;
    const distTgzPath = tgzPath.replace(`-${result.version}`, "");
    renameSync(tgzPath, distTgzPath);
    const distShaPath = distTgzPath.replace(/\.tgz$/i, ".sha");
    writeFileSync(distShaPath, result.integrity, { encoding: "utf-8" });
    console.log(`FILE: ${distTgzPath}`);
    console.log(`FILE: ${distShaPath}`);
    console.log(distTgzPath, result);
})();
