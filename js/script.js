class MediaGallery extends HTMLElement {
    current = 0;

    connectedCallback() {
        this.items = [...this.querySelectorAll("img, video")];

        this.overlay = document.createElement("div");
        this.overlay.className = "media-gallery-overlay";
        this.overlay.innerHTML = `
            <button class="prev">&#10094;</button>
            <div class="content"></div>
            <button class="next">&#10095;</button>
        `;

        document.body.appendChild(this.overlay);

        this.content = this.overlay.querySelector(".content");

        this.overlay.addEventListener("click", e => {
            if (e.target === this.overlay)
                this.close();
        });

        this.overlay.querySelector(".prev")
            .onclick = e => {
                e.stopPropagation();
                this.show(this.current - 1);
            };

        this.overlay.querySelector(".next")
            .onclick = e => {
                e.stopPropagation();
                this.show(this.current + 1);
            };

        this.items.forEach((item, i) => {
            item.style.cursor = "zoom-in";
            item.addEventListener("click", () => this.show(i));
        });

        document.addEventListener("keydown", e => {
            if (!this.overlay.classList.contains("open"))
                return;

            if (e.key === "Escape")
                this.close();

            if (e.key === "ArrowLeft")
                this.show(this.current - 1);

            if (e.key === "ArrowRight")
                this.show(this.current + 1);
        });
    }

    show(index) {
        index = (index + this.items.length) % this.items.length;
        this.current = index;

        this.overlay.classList.add("open");

        this.content.classList.add("fade-out");

        setTimeout(() => {
            this.content.replaceChildren();

            const clone = this.items[index].cloneNode(true);

            if (clone.tagName === "VIDEO") {
                clone.controls = true;
                clone.autoplay = true;
            }

            this.content.appendChild(clone);

            this.content.classList.remove("fade-out");
        }, 200);
    }

    close() {
        this.overlay.classList.remove("open");
        this.content.replaceChildren();
    }
}

customElements.define("media-gallery", MediaGallery);

class AppIcon extends HTMLElement {
    connectedCallback() {
        const src = this.getAttribute('src') || "";
        const color = this.getAttribute('color') || "var(--screenshot-shadow-color)";
        this.innerHTML = `<img class="app-icon" src="${src}" style="filter: drop-shadow(1px 0 30px ${color});" alt="App Icon">`
    }
}

function badgeLink(link , img) {
    return `
    <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img src="${img}" height="100px" alt="GitHub">
    </a>`
}

function githubLink(repo) {
    return `
    <a href="${repo}" target="_blank" rel="noopener noreferrer">
        <img src="assets/get-it-on-github.png" height="100px" alt="GitHub">
    </a>`
}

function flathubLink(link) {
    return `
    <a href="${link}" target="_blank" rel="noopener noreferrer">
        <img src="https://flathub.org/api/badge?locale=en" alt="Flathub">
    </a>
    `
}

function guiAppSection(appName, icon, iconColor, summary , description, githubLink, flathubLink, screenshots = [], videos = []) {
    return `
        <section class="app-showcase" style="--icon-color:${iconColor};">
            <div class="app-header">
                ${icon != "" ?
            `<img class="app-icon" src="${icon}" style="filter: drop-shadow(1px 0 30px var(--icon-color));" alt="App Icon">` : ""
        }
                <div class="app-info">
                    <h2>${appName}</h2>
                    <p class="summary">
                        ${summary}
                    </p>
                    <p class="description">
                        ${description}
                    </p>
                    <div class="store-links">
                    ${githubLink != "" ? `
                        <a href="${githubLink}" target="_blank" rel="noopener noreferrer">
                            <img src="assets/get-it-on-github.png" height="100px" alt="GitHub">
                        </a>
                        `: ""}
                    ${flathubLink != "" ? `
                        <a href="${flathubLink}" target="_blank" rel="noopener noreferrer">
                            <img src="https://flathub.org/api/badge?locale=en" alt="Flathub">
                        </a>
                        ` : ""}
                    </div>
                </div>
            </div>
            ${videos != [] || screenshots != [] ? `
                    <media-gallery class="screenshots">
                        ${videos}
                        ${screenshots.map((screenshot, index) => `<img src="${screenshot}" alt="Screenshot ${index}">`).join("\n")}   
                    </media-gallery>               
                `:"" 
            }   
        </section>
    `
}

function video(src , type) {
    return `
    <video controls autoplay muted loop>
        <source src="${src}" type="video/${type}">
        Your browser does not support the video tag.
    </video>
`
}

class VideoSource {
    constructor(src,type) {
        this.src = src
        this.type = type
    }

    toSourceTag() {
        return `<source src="${this.src}" type="video/${this.type}">`
    }

    toVideoTag() {
        return `
            <video controls autoplay muted loop>
                ${this.toSourceTag()}
                Your browser does not support the video tag.
            </video>
        `
    }
}

class Video {
    constructor(sources = []) {
        this.sources = sources
    }
    toVideoTag() {
        return `
            <video controls autoplay muted loop>
                ${ this.sources.map( (source) => source.toSourceTag() ).join("\n") }
                Your browser does not support the video tag.
            </video>
        `
    }
}


function ulist(...items) {
    return "<ul>" + items.map(
        (item) => "<li>" + item + "</li>"
    ).join("\n") + "</ul>"
}


function olist(...items) {
    return "<ol>" + items.map(
        (item) => "<li>" + item + "</li>"
    ).join("\n") + "</ol>"
}

function tag(text) {
    return `<span class="tag">${text}</span>`
}

function tags(...texts) {
    return `<div class="hbox wrap">` + texts.map((text) => tag(text)).join("\n") + `</div>`
}

function creationDate(date) {
    return `<p class="creation-date">${date}</p>`
}

class GUIApps extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            guiAppSection(
                "Coulomb",
                "assets/coulomb-icon.svg",
                "#e5a50a",
                "Coulomb is a simple and elegant electronic circuit simulator for Linux desktop.",
                tags("Java","Kotlin","Gtk4","Libadwaita","ejml","Electronic Circuit Theory","Linear Algebra") + 
                creationDate("Created in 2022"),
                "https://github.com/hamza-algohary/Coulomb",
                "https://flathub.org/en/apps/io.github.hamza_algohary.Coulomb",
                [
                    "assets/coulomb-screenshots/double-clipper-light.png",
                    "assets/coulomb-screenshots/double-clipper-dark.png",
                    "assets/coulomb-screenshots/led-dark.png",
                    "assets/coulomb-screenshots/ohm-light.png",
                    "assets/coulomb-screenshots/rlc-dark.png",
                    "assets/coulomb-screenshots/rlc-light.png",
                    "assets/coulomb-screenshots/zener-dark.png",
                ],
                [
                    new Video(
                        [
                            new VideoSource("assets/videos/coulomb-edited.webm","webm"),
                            new VideoSource("assets/videos/coulomb-edited.mp4","mp4")
                        ]
                    ).toVideoTag()
                ]
            ) +
            guiAppSection(
                "TV Shell",
                "assets/tvtime.svg",
                "#4f4f4f",
                "A TV home screen for Linux. Launch apps and switch windows through remote controller.",
                tags("Kotlin","Gtk4","Libadwaita","Wayland","Linux Desktop")+ 
                creationDate("Created in 2026"),
                "https://github.com/hamza-algohary/tvland",
                "",
                [
                    "assets/tv-screenshots/light.png",
                    "assets/tv-screenshots/dark.png"
                ]
            ) +
            guiAppSection(
                "Wayland TV Input Methods",
                "assets/osk-icon1.svg",
                "#4f4f4f",
                "",
                "It is a single program with two components:" +
                ulist(
                    "On-screen-keyboard for Wayland compositors, with support for gamepad controllers and joysticks.",
                    "Translation layer to map gamepad inputs to keyboard and mouse events for system-wide interaction."
                ) +
                tags("Kotlin","Gtk4","Wayland","LayerShell","Input Emulation")+ 
                creationDate("Created in 2026") ,
                "https://github.com/hamza-algohary/tvland",
                "",
                [
                    "assets/osk-screenshots/english.png",
                    "assets/osk-screenshots/arabic.png",
                ]
            ) +
            guiAppSection(
                "Queueing System Simulator",
                "assets/queue.svg",
                "#454564",
                "An app to apply and experiment with concepts of queueing theory.",
                tags("Kotlin","Gtk4","Simulation") + 
                creationDate("Created in 2025"),
                "https://github.com/hamza-algohary/queuesim",
                "",
                [
                    "assets/queuesim-screenshots/1.png",
                    "assets/queuesim-screenshots/2.png"
                ]
            ) +
            guiAppSection(
                "Linux Image Viewer",
                "assets/iamge-viewer-icon.svg",
                "#23b1ff",
                "A simple image viewer for Linux.",
                tags("C++","Gtk3","Linux","CSS") + 
                creationDate("Created in 2020"),
                "https://github.com/hamza-algohary/LinuxImageViewer",
                "",
                [
                    "assets/image-viewer-screenshots/image-viewer-scr.png",
                    "assets/image-viewer-screenshots/img-view-zoom.png",
                    "assets/image-viewer-screenshots/settings.png",
                    "assets/image-viewer-screenshots/about-img-viewer.png"
                ]
            ) +
            guiAppSection(
                "Exploding Fire Particle Simulation",
                "assets/explosion-icon-enhanced.png",
                "#a15dde",
                "An infinite explosion simulation,that is very satisfying to look at.",
                tags("C++","SDL2") + 
                creationDate("Created in 2019"),
                "https://github.com/hamza-algohary/Exploding-Particle-Simulation",
                "",
                [
                    "assets/explosion-screenshots/1.png",
                    "assets/explosion-screenshots/2.png",
                    "assets/explosion-screenshots/3.png",
                    "assets/explosion-screenshots/4.png",
                    "assets/explosion-screenshots/5.png",
                    "assets/explosion-screenshots/6.png",
                    "assets/explosion-screenshots/7.png",
                    "assets/explosion-screenshots/8.png",
                    "assets/explosion-screenshots/9.png",
                    "assets/explosion-screenshots/10.png",
                    "assets/explosion-screenshots/11.png",
                    "assets/explosion-screenshots/12.png"
                ],
                [
                    new Video(
                        [
                            new VideoSource("assets/videos/exploding-fire-particle-simulation.webm" , "webm"),
                            new VideoSource("assets/videos/exploding-fire-particle-simulation.mp4" , "mp4")
                        ]
                    ).toVideoTag()
                ]
            ) 
    }
}

class CLIAppsSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
            guiAppSection(
                "Tuber",
                "assets/video.svg",
                "#9c27b0",
                "A CLI frontend for YouTube, PeerTube, SoundCloud and other sites moreover, it is suitable for usage as a backend since all its output is in JSON format.",
                "Tuber implements 4 major features:" +
                ulist(
                    "Media search aggregator (plugins based, with some plugins builtin)",
                    "URL Handler for many sites (plugins based, with some plugins builtin) to allow proper display of channels and playlists, and play video and audio streams.",
                    "Unified schema for all the above, providing types like Stream, Playlist and Channel allowing frontend to transparently support new sites just by adding plugins. So frontend need not support individual sites.",
                    "Locally indexed lists, supporting fuzzy and semantic search, to aid frontends implement features such as IPTV, and Whitelists."
                ) +                 
                tags("Kotlin","SQLite","Apache Lucene") + 
                creationDate("Created in 2025") ,
                "https://github.com/hamza-algohary/tuber",
                ""
            ) +
            guiAppSection(
                "libflatpakcli",
                "assets/flatpak.svg",
                "#e4ba75",
                "A CLI for flatpak with machine readable output, to be used instead of libflatpak for languages that don't have a libflatpak binding.",
                tags("Rust","libflatpak") + 
                creationDate("Created in 2026"),
                "https://github.com/hamza-algohary/libflatpakcli",
                ""
            ) +
            guiAppSection(
                "Mandelbrot Generator",
                "assets/mandelbrot.png",
                "#012883",
                "A CLI program to generate images of Mandelrtbot fractals.",
                tags("C++") + 
                creationDate("Created in 2020"),
                "https://github.com/hamza-algohary/Mandelbrot-Generator",
                "",
                [
                    "assets/mandelbrot-samples/1.bmp",
                    "assets/mandelbrot-samples/2.bmp",
                    "assets/mandelbrot-samples/3.bmp",
                    "assets/mandelbrot-samples/4.bmp",
                    "assets/mandelbrot-samples/5.bmp",
                    "assets/mandelbrot-samples/6.bmp",
                    "assets/mandelbrot-samples/7.bmp",
                    "assets/mandelbrot-samples/8.bmp",
                    "assets/mandelbrot-samples/9.bmp",
                    "assets/mandelbrot-samples/11.bmp",
                    "assets/mandelbrot-samples/12.bmp",
                    "assets/mandelbrot-samples/13.bmp",
                    "assets/mandelbrot-samples/14.bmp",
                    "assets/mandelbrot-samples/15.bmp",
                ]
            ) +
            guiAppSection(
                "tasks.sh",
                "assets/tasks.svg",
                "#9f9f9f",
                "Schedule commands to run at a certain time daily.",
                tags("Bash") + 
                creationDate("Created in 2024"),
                "https://github.com/hamza-algohary/tasks.sh",
                ""
            ) 
    }
}

class LibrariesSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
            guiAppSection(
                "gtkx + gtky",
                "",
                "",
                "Kotlin extensions for Gtk4 and libadwaita, using bindings of Java-GI" + 
                creationDate("Created in 2025"),
                "",
                "https://github.com/hamza-algohary/tvland",
                ""
            ) +
            guiAppSection(
                "libwayland for Kotlin",
                "",
                "",
                "Wayland Client library written from scratch in Kotlin JVM, it includes a protocols scanner and code generator." + 
                creationDate("Created in 2026"),
                "",
                "https://github.com/hamza-algohary/tvland",
                ""
            )
    }
}


customElements.define("libraries-section",LibrariesSection)
customElements.define("cli-apps", CLIAppsSection)
customElements.define("gui-apps", GUIApps)
customElements.define('app-icon', AppIcon);