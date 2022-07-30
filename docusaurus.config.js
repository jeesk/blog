// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '山间草夫的小站',
  tagline: '这里将为你带来一副山间草夫的清明上河图!',
  url: 'https://shanjiancaofu.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  projectName: 'jeesk.github.io', // Usually your repo name.
  deploymentBranch: "master",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.


  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: "ALL",
          blogSidebarTitle: 'All Blog Posts',
          editLocalizedFiles: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "spring",
        routeBasePath: "spring",
        path: "spring",
      }
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "java",
        routeBasePath: "java",
        path: "java",
      }
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "microservice",
        routeBasePath: "microservice",
        path: "microservice",
      }
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "data-structure-and-algorithm",
        routeBasePath: "data-structure-and-algorithm",
        path: "data-structure-and-algorithm",
      }
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "devops",
        routeBasePath: "devops",
        path: "devops",
        showReadingTime: true,
        blogSidebarCount: "ALL",
        blogSidebarTitle: 'All Blog Posts',
        editLocalizedFiles: true
      }
    ]
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '山间草夫',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
            {
              type: 'doc',
              docId: 'intro',
              position: 'left',
              label: '源码分析',
            },
            { to: '/java', label: 'Java', position: 'left' },
            { to: '/devops', label: 'Devops', position: 'left' },
            { to: '/data-structure-and-algorithm', label: '数据结构与算法', position: 'left' },
            { to: '/blog', label: 'Blog', position: 'left' },
            {
              href: 'https://github.com/jeesk',
              label: 'GitHub',
              position: 'right',
            }
          ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
