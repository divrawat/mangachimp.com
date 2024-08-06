export async function getServerSideProps({ params, res }) {
    try {
        // Fetch the manga chapters
        const response = await getmangachaptersRelated(params?.slug);
        const metatags = await getAllMetaTags();
        if (response?.error) {
            return { props: { errorcode: true } };
        }

        // Sort the chapters
        const sortChapters = (chapterNumbers) => {
            return chapterNumbers?.sort((a, b) => {
                const parseChapter = (chapter) => {
                    const match = chapter.match(/(\d+)([a-z]*)/i);
                    return [parseInt(match[1]), match[2] || ''];
                };
                const [numA, suffixA] = parseChapter(a);
                const [numB, suffixB] = parseChapter(b);
                return numA !== numB ? numA - numB : suffixA.localeCompare(suffixB);
            });
        };

        const chapterNumbers = response?.data?.map(chapter => chapter.chapterNumber) || [];
        const sortedChapterNumbers = sortChapters(chapterNumbers);
        const reversedChapterNumbers = sortedChapterNumbers.reverse();

        // Set caching headers
        res.setHeader('Cache-Control', 'public, s-maxage=10800, stale-while-revalidate=59');

        // Return props
        return { props: { manga: response, chapterArray: reversedChapterNumbers, metatags: metatags?.data } };
    } catch (error) {
        console.error('Error fetching manga data:', error);
        return { props: { errorcode: true } };
    }
}




import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { getmangachaptersRelated } from '@/actions/manga';
import { DOMAIN, APP_NAME, NOT_FOUND_IMAGE, APP_LOGO, IMAGES_SUBDOMAIN } from '@/config';
import { getAllMetaTags } from '@/actions/metatags';
import { FaHome } from "react-icons/fa";
import { Rubik } from '@next/font/google';
import { AiFillChrome } from "react-icons/ai";
import dynamic from 'next/dynamic';
const DisqusComments = dynamic(() => import('@/components/DisQus'), { ssr: false });
const roboto = Rubik({ subsets: ['latin'], weight: '800' });
const roboto2 = Rubik({ subsets: ['latin'], weight: '600', });
import React from 'react';
import parse from 'html-react-parser';
export const runtime = 'experimental-edge';


const MangaPage = ({ errorcode, manga, chapterArray, metatags }) => {

    const mangaurl = manga?.manga?.slug;

    if (errorcode) {
        const head = () => (
            <Head>
                <title>{`404 Page Not Found: ${APP_NAME}`}</title>
            </Head >
        );
        return (
            <>
                {head()}
                <Navbar />
                <div className="text-center text-white">
                    <h1 className="text-3xl font-bold mt-5 mb-8">404 Page Not Found</h1>
                    <div className="flex justify-center items-center px-5">
                        <img height={350} width={350} src={`${NOT_FOUND_IMAGE}`} className="rounded-full" />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const categoryNames = manga?.manga?.categories.map(category => category.name).join(', ');

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Person", "Organization"],
                "@id": `${DOMAIN}/#person`,
                "name": `${APP_NAME}`,
                "sameAs": ["https://x.com/divrawat2001"],
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${DOMAIN}/#logo`,
                    "url": `${APP_LOGO}`,
                    "contentUrl": `${APP_LOGO}`,
                    "caption": `${APP_NAME}`,
                    "inLanguage": "en-US",
                    "width": "80",
                    "height": "80"
                },
                "image": {
                    "@type": "ImageObject",
                    "@id": `${DOMAIN}/#logo`,
                    "url": `${APP_LOGO}`,
                    "contentUrl": `${APP_LOGO}`,
                    "caption": `${APP_NAME}`,
                    "inLanguage": "en-US",
                    "width": "80",
                    "height": "80"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${DOMAIN}/#website`,
                "url": `${DOMAIN}`,
                "name": `${APP_NAME}`,
                "publisher": {
                    "@id": `${DOMAIN}/#person`
                },
                "inLanguage": "en-US"
            },
            {
                // {`${IMAGES_SUBDOMAIN}/${manga?.slug}/cover-image/1.webp`}
                "@type": "ImageObject",
                "@id": `${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`,
                "url": `${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`,
                "width": "1280",
                "height": "1830",
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/${mangaurl}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "item": {
                            "@id": `${DOMAIN}`,
                            "name": "Home"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "item": {
                            "@id": `${DOMAIN}/${mangaurl}`,
                            "name": `${manga?.manga?.name}`
                        }
                    },
                ]
            },
            {
                "@type": "WebPage",
                "@id": `${DOMAIN}/${mangaurl}/#webpage`,
                "url": `${DOMAIN}/${mangaurl}/#webpage`,
                "name": `${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "datePublished": `${manga?.manga?.createdAt}`,
                "dateModified": `${manga?.manga?.createdAt}`,
                "isPartOf": {
                    "@id": `${DOMAIN}/#website`
                },
                "primaryImageOfPage": {
                    "@id": `${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`
                },
                "inLanguage": "en-US",
                "breadcrumb": {
                    "@id": `${DOMAIN}/${mangaurl}/#breadcrumb`
                }
            },
            {
                "@type": "Person",
                "@id": `${DOMAIN}/${mangaurl}/#author`,
                "image": {
                    "@type": "ImageObject",
                    "@id": "https://secure.gravatar.com/avatar/?s=96&amp;d=mm&amp;r=g",
                    "url": "https://secure.gravatar.com/avatar/?s=96&amp;d=mm&amp;r=g",
                    "inLanguage": "en-US"
                }
            },
            {
                "@type": "Article",
                "headline": `Read ${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "datePublished": `${manga?.manga?.createdAt}`,
                "dateModified": `${manga?.manga?.createdAt}`,
                "articleSection": categoryNames,
                "author": {
                    "@id": `${DOMAIN}/${mangaurl}/#author`
                },
                "publisher": {
                    "@id": `${DOMAIN}/#person`
                },
                "description": `${manga?.manga?.description}`,
                "name": `Read ${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "@id": `${DOMAIN}/${mangaurl}/#richSnippet`,
                "isPartOf": {
                    "@id": `${DOMAIN}/${mangaurl}/#webpage`
                },
                "image": {
                    "@id": `${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`
                },
                "inLanguage": "en-US",
                "mainEntityOfPage": {
                    "@id": `${DOMAIN}/${mangaurl}/#webpage`
                }
            }
        ]
    }

    const DESCRIPTION = `Read ${manga?.manga?.name} ${manga?.manga?.type} online. ${manga?.manga?.description}`;

    const parseMetaTags = (htmlString) => {
        if (!htmlString) return null;
        return parse(htmlString);
    };

    const head = () => (
        <Head>
            <title>{`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            {/* {metatags?.map((metaTag, index) => (
                <React.Fragment key={index}>
                    {parseMetaTags(metaTag.content)}
                </React.Fragment>
            ))} */}
            <meta name="googlebot" content="noarchive" />
            <meta name="robots" content="noarchive" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <link rel="canonical" href={`${DOMAIN}/${mangaurl}`} />
            <meta property="og:title" content={`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/${mangaurl}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`} />
            <meta property="og:image:secure_url" content={`${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`} />
            <meta property="og:image:type" content="image/webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:site" content="@mangachimp" />
            <meta name="twitter:creator" content="@mangachimp" />
            <meta name="twitter:image" content={`${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`} />
            <meta name="twitter:label1" content="Written by" />
            <meta name="twitter:data1" content={`${APP_NAME}`} />
            <meta name="twitter:label2" content="Time to read" />
            <meta name="twitter:data2" content="1 minute" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head >
    );


    function splitTextIntoParagraphs(text, sentencesPerParagraph = 3) {
        const sentences = text?.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const paragraphs = [];
        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            const paragraph = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
            paragraphs.push(paragraph);
        }
        return paragraphs;
    }

    const paragraphs = splitTextIntoParagraphs(manga?.manga?.longdescription);

    return (
        <>
            {head()}
            <Navbar />
            <main>
                <article>

                    <div className='px-3'>
                        <div className='max-w-[1000px] mx-auto mt-8 bg-[#091e25] rounded shadow px-3 text-white '>
                            <h1 className={`${roboto.className} text-center font-bold text-2xl pt-6 pb-5 `}>{`${manga?.manga?.fullname} ${manga?.manga?.type}`}</h1>
                            <img className="mx-auto w-[200px]" src={`${IMAGES_SUBDOMAIN}/${manga?.manga?.slug}/cover-image/1.webp`} alt={`${manga?.manga?.name} Cover`} />
                            <p className="my-5 leading-[2] md:px-6 px-2 text-center ">{manga?.manga?.description}</p>

                            <div className='max-w-[800px] mx-auto'>
                                <div className="flex flex-wrap justify-center gap-5 px-4">
                                    {manga?.manga?.categories?.map((category, index) => (
                                        <Link prefetch={false} href={`${DOMAIN}/categories/${category?.slug}?page=1`} key={index} className="text-white text-[13px] bg-[#051015]  font-bold py-1.5 px-2 rounded hover:scale-110 active:scale-95 transition-transform">
                                            {category?.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>


                            <div className="flex justify-center items-center md:gap-[150px] sm:gap-[100px] pb-8 gap-10 flex-wrap mt-14">
                                <div className="text-center">
                                    <p className="font-bold text-[21px] mb-2">Release</p>
                                    <p>{manga?.manga?.releaseDate}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-bold text-[21px] mb-2">Author</p>
                                    <p>{manga?.manga?.author}</p>
                                </div>

                                <div className="text-center">
                                    <p className="font-bold text-[21px] mb-2">Type</p>
                                    <p>{manga?.manga?.type}</p>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className={`${roboto.className} text-3xl px-2 font-bold tracking-wider text-center md:mt-[100px] mt-10 mb-5 text-white`}>{`Read ${manga?.manga?.name} ${manga?.manga?.type}`}</div>

                    <div className='flex justify-center text-[13px] flex-wrap items-center gap-3 mb-10 text-blue-300'>

                        <div className='flex items-center gap-2'>
                            <div><FaHome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                        </div>

                        <div>{`->`}</div>

                        <div className='flex items-center gap-2'>
                            <div><AiFillChrome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}/manga/${mangaurl}`}>{`${manga?.manga?.name}`}</Link></div>
                        </div>

                    </div>


                    <div className="mt-10 max-w-[1100px] mb-10 mx-auto px-5 flex flex-wrap justify-center">
                        {chapterArray?.map((chapternumber, index) => (
                            <div className="flex hover:scale-105 active:scale-95 transition-transform" key={index}>
                                <Link prefetch={false} href={`${DOMAIN}/manga/${mangaurl}/chapter-${chapternumber}`} className="sm:p-5 p-2 pb-5 hover:underline text-white">
                                    <p className="sm:w-[200px] w-[120px] text-[12px] sm:text-[16px] bg-[#091e25] text-center sm:p-5 p-2 rounded shadow font-bold break-words border-l-4 ">
                                        {` Chapter ${chapternumber}`}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>


                    <div className='py-10 bg-[#051015] '>
                        <h2 className='text-4xl text-center text-[white] font-blod px-4 mb-10'>Comment Section</h2>
                        <section className='max-w-[1000px] mx-auto px-5'>
                            <DisqusComments url={`/manga/${mangaurl}`} identifier={mangaurl} title={`${manga?.manga?.name} ${manga?.manga?.type}`} />
                        </section>
                    </div>


                    <div className="max-w-[1200px] mx-auto mt-10 px-3">
                        <h2 className={`${roboto.className} text-center text-3xl font-bold pb-10 text-white`}>Related</h2>
                        <div className="flex justify-center sm:gap-10 gap-3 flex-wrap pb-10">
                            {manga?.relatedMangas?.map((manga, index) => (
                                <div className="hover:scale-110 transition-transform rounded shadow sm:w-[190px] w-[45%] text-white" key={index}>
                                    <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                        <img src={`${IMAGES_SUBDOMAIN}/${manga?.slug}/cover-image/1.webp`} alt={`${manga?.name} Cover`} className="mb-2 sm:h-[200px] sm:w-[190px] h-[200px] w-full object-cover" />
                                        <div className='px-2 py-3'>
                                            <p className="sm:text-[11px] text-[10px] my-1 py-1  font-bold">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                            <p className={`${roboto2.className} sm:text-[14px] text-[10px] font-semibold mb-1 text-wrap break-words`}>{manga?.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>




                    <div className='max-w-[800px] mx-auto mt-10 px-5 '>
                        {paragraphs?.map((paragraph, index) => (
                            <p key={index} className='text-white py-6 tracking-wider leading-8 text-[15px]'>{paragraph}</p>
                        ))}
                    </div>




                </article >
            </main>
            <Footer />
        </>
    );
}


export default MangaPage;