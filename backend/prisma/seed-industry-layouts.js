/**
 * Seed Industry / plumbing layout rows for admin custom-layouts.
 * Keys match sectionRegistry (PlumbingBanner1, PlumbingAbout1, …) so the
 * admin preview renders the live component. Re-run after adding a Plumbing*
 * component to sectionRegistry.
 *
 * Run: npm run db:seed:industry-layouts -w backend
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORY_SLUG = 'industry';
const REGISTRY_PATH = path.resolve(
  __dirname,
  '../../frontend/app/editor/layout/src/lib/sectionRegistry.ts',
);

const HOME_KEYS = new Set([
  'PlumbingHeader1',
  'PlumbingFooter1',
  'PlumbingBanner1',
  'PlumbingAbout1',
  'PlumbingPartners1',
  'PlumbingService1',
  'PlumbingWhyChooseUs1',
  'PlumbingHowWeWork1',
  'PlumbingTestimonial1',
  'PlumbingBlog1',
  'PlumbingContact1',
]);

const SECTION_TYPE_BY_KEY = {
  PlumbingHeader1: 'Header',
  PlumbingFooter1: 'Footer',
  PlumbingBanner1: 'Banner',
  PlumbingAbout1: 'About',
  PlumbingAboutPage1: 'AboutPage',
  PlumbingPartners1: 'Partners',
  PlumbingService1: 'Service',
  PlumbingServicePage1: 'ServicePage',
  PlumbingServicesdetailsPage1: 'ServiceDetails',
  PlumbingWhyChooseUs1: 'WhyChooseUs',
  PlumbingHowWeWork1: 'HowWeWork',
  PlumbingTestimonial1: 'Testimonial',
  PlumbingTestimonialPage1: 'TestimonialPage',
  PlumbingBlog1: 'Blog',
  PlumbingBlogPage1: 'BlogPage',
  PlumbingBlogDetails1: 'BlogDetails',
  PlumbingContact1: 'Contact',
  PlumbingContactPage1: 'ContactPage',
  PlumbingAward1: 'Award',
  PlumbingCareer1: 'Career',
  PlumbingJobDetails1: 'JobDetails',
  PlumbingEnquiry1: 'Enquiry',
  PlumbingFaq1: 'FAQ',
  PlumbingIndustry1: 'Industry',
  PlumbingMissionPage1: 'MissionPage',
  PlumbingPricing1: 'Pricing',
  PlumbingQuote1: 'Quote',
  PlumbingProject1: 'Project',
  PlumbingProjectDetails1: 'ProjectDetails',
  PlumbingSitemap1: 'Sitemap',
  PlumbingTeam1: 'Team',
  PlumbingTeamDetails1: 'TeamDetails',
  PlumbingPrivacyPolicy1: 'PrivacyPolicy',
  PlumbingDisclaimer1: 'Disclaimer',
  PlumbingTermsConditions1: 'TermsConditions',
  PlumbingCookiePolicy1: 'CookiePolicy',
  PlumbingRefundPolicy1: 'RefundPolicy',
};

function readPlumbingComponents() {
  const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const names = [];
  const seen = new Set();
  const re = /import (Plumbing[A-Za-z0-9]+) from /g;
  let match = re.exec(source);
  while (match) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      names.push(match[1]);
    }
    match = re.exec(source);
  }
  if (!names.length) {
    throw new Error(`No Plumbing components found in ${REGISTRY_PATH}`);
  }
  return names;
}

function displayName(key) {
  const withoutNumber = key.replace(/\d+$/, '');
  const words = withoutNumber
    .replace(/^Plumbing/, 'Plumbing ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  return words;
}

async function main() {
  await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    create: {
      order: 4,
      name: 'Industry',
      slug: CATEGORY_SLUG,
      icon: 'lucide-wrench',
      description: 'Plumbing and industry service sites',
      status: 'Active',
    },
    update: {
      name: 'Industry',
      status: 'Active',
    },
  });

  const components = readPlumbingComponents();
  let created = 0;
  let updated = 0;

  for (let index = 0; index < components.length; index += 1) {
    const key = components[index];
    const sectionType = SECTION_TYPE_BY_KEY[key];
    if (!sectionType) {
      throw new Error(`Missing section type for ${key}`);
    }
    const sectionNumber = Number(key.match(/(\d+)$/)?.[1] || 1);
    const layout = {
      key,
      name: displayName(key),
      sectionType,
      sectionNumber,
      scope: HOME_KEYS.has(key) ? 'home' : 'page',
      order: index + 1,
      categorySlug: CATEGORY_SLUG,
      description: `Industry component ${key}. Preview uses the live section component.`,
    };

    const existing = await prisma.layout.findUnique({ where: { key } });
    const row = await prisma.layout.upsert({
      where: { key },
      create: { ...layout, status: 'Active' },
      update: {
        name: layout.name,
        sectionType: layout.sectionType,
        sectionNumber: layout.sectionNumber,
        scope: layout.scope,
        order: layout.order,
        categorySlug: layout.categorySlug,
        description: layout.description,
        status: 'Active',
      },
    });
    if (existing) updated += 1;
    else created += 1;
    console.log(`✓ ${row.key} [${row.categorySlug}] ${row.scope} ${row.sectionType}`);
  }

  console.log(
    `\nDone: ${components.length} Industry layouts (created ${created}, updated ${updated})`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
