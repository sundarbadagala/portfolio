const about = {
  name: "Sunara Rao Badagala",
  greeting: "Hell World!",
  intro: "This is the small intruduction about me.",
  bio: "I'm a skilled Fronted developer with 3+ years experience in designing, developing and maintaining fronted applications with proficient knowledge in React JS, JavaScript, Web Development.",
  skills: ["React JS", "JavaScript", "HTML", "CSS"],
  links: [
    { label: "GitHub",   href: "https://github.com/sundarbadagala",          target: "_blank" },
    { label: "Dev.to",   href: "https://dev.to/sundarbadagala081",            target: "_blank" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sundarbadagala/", target: "_blank" },
    { label: "Gmail",    href: "mailto:sundar.badagala@gmail.com",            target: "_self"  }
  ],
  version: "1.0.0"
};

$(function () {
  $("#about_greeting").text(about.greeting);
  $("#about_name").text(about.name);
  $("#about_intro").text(about.intro);
  $("#about_bio").text(about.bio);
  $("#about_version").text(`version ${about.version}`);
  $("#about_copyright").text("ⓒSundara Rao Badagala");

  $("#about_skills").html(about.skills.map(s => `<li>${s}</li>`).join(""));

  $("#about_links").html(
    about.links.map(({ label, href, target }) =>
      `<li><a href="${href}" target="${target}">${label}</a></li>`
    ).join("")
  );
});
