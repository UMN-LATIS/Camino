// docs/.vitepress/config.ts

const GITHUB_ORG_URL = "https://github.com/UMN-LATIS";
const REPO_NAME = "Camino";

export default {
  lang: "en-US",
  title: `${REPO_NAME} Help`,
  base: `/${REPO_NAME}/`,
  lastUpdated: true,
  themeConfig: {
    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "Introduction",
            link: "/",
          },
          {
            text: "Creating Tours",
            link: "/creating"
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: `${GITHUB_ORG_URL}/${REPO_NAME}` }],
    editLink: {
      pattern: `${GITHUB_ORG_URL}/${REPO_NAME}/edit/main/docs/:path`,
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Made with ❤️ by LATIS",
      copyright: "Copyright © University of Minnesota",
    },
    // optional search config
    // algolia: {
    //   appId: "",
    //   apiKey: "",
    //   indexName: "",
    // },
  },
};
