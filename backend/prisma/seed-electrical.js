/**
 * Seed HomeServices category, ElectroCare layouts, template-electrical-1,
 * and that template's JSON content. Does not update other categories,
 * templates, or shared content.
 *
 * Run: npm run db:seed:electrical -w backend
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORY_NAME = 'Home Services';
const CATEGORY_SLUG = 'home-services';
const TEMPLATE_KEY = 'template-electrical-1';
const JSON_PATH = path.resolve(
  __dirname,
  '../../frontend/app/editor/layout/src/data/categoryContent.json',
);
const REGISTRY_PATH = path.resolve(
  __dirname,
  '../../frontend/app/editor/layout/src/lib/sectionRegistry.ts',
);

const SECTION_TYPE_BY_KEY = {
  ElectricalTopbar1: 'Topbar',
  ElectricalHeader1: 'Header',
  ElectricalFooter1: 'Footer',
  ElectricalBanner1: 'Banner',
  ElectricalAbout1: 'About',
  ElectricalAboutPage1: 'AboutPage',
  ElectricalService1: 'Service',
  ElectricalServicePage1: 'ServicePage',
  ElectricalServiceDetails1: 'ServiceDetail',
  ElectricalStats1: 'Stats',
  ElectricalTestimonial1: 'Testimonial',
  ElectricalWhyChooseUs1: 'WhyChooseUs',
  ElectricalHowWeWork1: 'HowWeWork',
  ElectricalContact1: 'ContactPage',
  ElectricalGallery1: 'GalleryPage',
  ElectricalQuote1: 'Quote',
  ElectricalThankYou1: 'ThankYou',
  ElectricalNotFound1: 'NotFound',
  ElectricalBreadcrumb1: 'Breadcrumb',
};

const HOME_KEYS = new Set([
  'ElectricalTopbar1',
  'ElectricalHeader1',
  'ElectricalFooter1',
  'ElectricalBanner1',
  'ElectricalAbout1',
  'ElectricalService1',
  'ElectricalStats1',
  'ElectricalTestimonial1',
]);

function readElectricalComponents() {
  const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const names = [];
  const seen = new Set();
  const re = /import (Electrical[A-Za-z0-9]+) from /g;
  let match = re.exec(source);
  while (match) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      names.push(match[1]);
    }
    match = re.exec(source);
  }
  if (!names.length) {
    throw new Error(`No Electrical components found in ${REGISTRY_PATH}`);
  }
  return names;
}

function displayName(key) {
  return key
    .replace(/^Electrical/, 'Electrical ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d+)$/, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const template = (raw.templates || []).find((item) => item.id === TEMPLATE_KEY);
  const pack = raw.categories?.Electrical;
  if (!template) throw new Error(`Missing ${TEMPLATE_KEY} in categoryContent.json`);
  if (!pack?.common || !pack?.templateComponents) {
    throw new Error('Missing Electrical common/templateComponents JSON');
  }

  const named = await prisma.category.findFirst({
    where: { name: { equals: 'Home Services', mode: 'insensitive' } },
  });
  const categorySlug = named?.slug || CATEGORY_SLUG;
  if (!named) {
    await prisma.category.upsert({
      where: { slug: CATEGORY_SLUG },
      create: {
        order: 5,
        name: CATEGORY_NAME,
        slug: CATEGORY_SLUG,
        icon: 'lucide-home',
        description: 'Manage Home Services Templates',
        status: 'Active',
      },
      update: {
        name: CATEGORY_NAME,
        icon: 'lucide-home',
        description: 'Manage Home Services Templates',
        status: 'Active',
      },
    });
  }
  await prisma.category.deleteMany({
    where: { slug: 'homeservices', NOT: { slug: categorySlug } },
  });
  await prisma.categoryContent.deleteMany({
    where: { categorySlug: 'homeservices', NOT: { categorySlug } },
  });
  console.log(`✓ Category ${CATEGORY_NAME} (${categorySlug})`);

  const components = readElectricalComponents();
  let created = 0;
  let updated = 0;
  for (let index = 0; index < components.length; index += 1) {
    const key = components[index];
    const sectionType = SECTION_TYPE_BY_KEY[key];
    if (!sectionType) throw new Error(`Missing section type for ${key}`);
    const layout = {
      key,
      name: displayName(key),
      sectionType,
      sectionNumber: Number(key.match(/(\d+)$/)?.[1] || 1),
      scope: HOME_KEYS.has(key) ? 'home' : 'page',
      order: index + 1,
      categorySlug,
      description: `Home Services component ${key}. Preview uses the live section component.`,
    };
    const existing = await prisma.layout.findUnique({ where: { key } });
    await prisma.layout.upsert({
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
    console.log(`✓ Layout ${key}`);
  }

  const clash = await prisma.template.findFirst({
    where: { numericId: template.numericId, NOT: { key: TEMPLATE_KEY } },
  });
  if (clash) {
    throw new Error(
      `numericId ${template.numericId} is already used by ${clash.key}. Not changing it.`,
    );
  }

  await prisma.template.upsert({
    where: { key: TEMPLATE_KEY },
    create: {
      key: TEMPLATE_KEY,
      numericId: template.numericId,
      title: template.title,
      type: template.type,
      image: template.image || null,
      previewImage: template.previewimage || null,
      previewDescription: template.preview_description || null,
      prebuiltPages: template.prebuilt_pages ?? 0,
      pages: template.pages || null,
      homeSectionOrder: template.homeSectionOrder || null,
      sectionVariants: template.sectionVariants || {},
      variables: template.variables || {},
      order: template.numericId,
      status: 'Active',
    },
    update: {
      numericId: template.numericId,
      title: template.title,
      type: template.type,
      image: template.image || null,
      previewImage: template.previewimage || null,
      previewDescription: template.preview_description || null,
      prebuiltPages: template.prebuilt_pages ?? 0,
      pages: template.pages || null,
      homeSectionOrder: template.homeSectionOrder || null,
      sectionVariants: template.sectionVariants || {},
      variables: template.variables || {},
      order: template.numericId,
      status: 'Active',
    },
  });
  console.log(`✓ Template ${TEMPLATE_KEY}`);

  const existingContent = await prisma.categoryContent.findUnique({
    where: { categorySlug },
  });
  const previousKeys = Array.isArray(existingContent?.templateKeys)
    ? existingContent.templateKeys.filter((key) => typeof key === 'string')
    : [];
  const templateKeys = previousKeys.includes(TEMPLATE_KEY)
    ? previousKeys
    : [...previousKeys, TEMPLATE_KEY];
  const previousSections =
    existingContent?.sections &&
    typeof existingContent.sections === 'object' &&
    !Array.isArray(existingContent.sections)
      ? existingContent.sections
      : {};

  await prisma.categoryContent.upsert({
    where: { categorySlug },
    create: {
      categorySlug,
      categoryName: CATEGORY_NAME,
      templateKeys,
      sections: {
        ...previousSections,
        common: pack.common,
        templateComponents: pack.templateComponents,
      },
      status: 'Active',
    },
    update: {
      categoryName: CATEGORY_NAME,
      templateKeys,
      sections: {
        ...previousSections,
        common: pack.common,
        templateComponents: pack.templateComponents,
      },
      status: 'Active',
    },
  });
  console.log(`✓ CategoryContent ${CATEGORY_NAME}`);
  console.log(
    `\nDone: HomeServices electrical template (layouts created ${created}, updated ${updated})`,
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
