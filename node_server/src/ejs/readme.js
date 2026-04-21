const packageJson = require("../../package.json");

/**
 * @desc Read Me
 * @path GET /readme
 * @access public
 * @dir /views/readme.ejs
 */
module.exports = function (req, res) {
  res.render("readme", {
    title: "Read Me",
    header: "About App",
    name: packageJson.name,
    packages: () => {
      const packages = [];
      for (let package in packageJson.dependencies) {
        packages.push({
          name: package,
          version: packageJson.dependencies[package],
        });
      }
      return packages;
    },
    version: packageJson.version,
  });
};
