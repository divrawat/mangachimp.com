
export const DOMAIN = 'http://localhost:3000';
// export const BACKEND_DOMAIN = 'http://localhost:8000';

// export const DOMAIN = 'https://mangachimp.com';
export const BACKEND_DOMAIN = 'https://backend-mangawebsite.vercel.app'



export const DOMAIN_NAME = 'mangachimp.com';
export const IMAGES_SUBDOMAIN = "https://images.mangachimp.com";
export const DISQUS_SHORTNAME = "my-cms-7";


export const APP_NAME = 'Manga Chimp';
export const NavbarName = "Manga Chimp";

export const APP_LOGO = `${IMAGES_SUBDOMAIN}/public/logo.webp`;
export const NOT_FOUND_IMAGE = `${IMAGES_SUBDOMAIN}/public/404.webp`;
export const FAVICON = `${IMAGES_SUBDOMAIN}/public/favicon.png`;

export const navLinks = [
    { text: 'New Chapters', href: `${DOMAIN}/new-chapters` },
    { text: 'New Mangas', href: `${DOMAIN}/new-mangas` },
    // { text: 'Contact', href: `${DOMAIN}/contact` },
];

export const FooterLinks = [
    { text: 'About', href: `${DOMAIN}/about` },
    { text: 'Contact', href: `${DOMAIN}/contact` },
    { text: 'Disclaimer', href: `${DOMAIN}/disclaimer` },
    { text: 'Privacy Policy', href: `${DOMAIN}/privacy-policy` },
    { text: 'Terms & Conditions', href: `${DOMAIN}/terms-and-conditions` }
];