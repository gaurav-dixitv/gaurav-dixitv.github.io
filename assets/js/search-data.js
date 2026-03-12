// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Selected course material and resources for classes taught.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/assets/pdf/Gaurav%20Dixit%20-%20CV.pdf";
          },
        },{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2.html";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "teachings-multi-objective-decision-making-modem",
          title: 'Multi-Objective Decision Making (MODeM)',
          description: "A workshop on methods and applications for multi-objective decision making for human-centered autonomy.",
          section: "Teachings",handler: () => {
              window.location.href = "/teaching/ijcai-ecai-modem-workshop/";
            },},{id: "teachings-multi-objective-multi-agent-learning-evolutionary-and-reinforcement-learning-perspectives",
          title: 'Multi-Objective Multi-Agent Learning: Evolutionary and Reinforcement Learning Perspectives',
          description: "A tutorial on foundations, solution concepts, and learning methods for decision-making in multi-objective multi-agent settings.",
          section: "Teachings",handler: () => {
              window.location.href = "/teaching/moma-tutorial-ecai-24/";
            },},{id: "teachings-rob-537-learning-based-control",
          title: 'ROB 537 Learning-Based Control',
          description: "",
          section: "Teachings",handler: () => {
              window.location.href = "/teaching/rob-537-guest-lecture/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
