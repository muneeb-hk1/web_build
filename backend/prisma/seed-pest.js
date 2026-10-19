/**
 * Seed template-pest-1 under Home Services.
 * Appends the template key only. Does not change other templates,
 * layouts, or the existing Home Services content pack.
 *
 * Run: npm run db:seed:pest -w backend
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORY_NAME = 'Home Services';
const TEMPLATE_KEY = 'template-pest-1';
const JSON_PATH = path.resolve(
  __dirname,
  '../../frontend/app/editor/layout/src/data/categoryContent.json',
);

const HOME_TYPES = new Set([
  'Topbar',
  'Header',
  'Banner',
  'About',
  'Service',
  'Testimonial',
  'Blog',
  'Footer',
]);

function displayName(key) {
  return key
    .replace(/^Pest/, 'Pest ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d+)$/, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const template = (raw.templates || []).find((item) => item.id === TEMPLATE_KEY);
  if (!template) throw new Error(`Missing ${TEMPLATE_KEY} in categoryContent.json`);

  const named = await prisma.category.findFirst({
    where: { name: { equals: CATEGORY_NAME, mode: 'insensitive' } },
  });
  if (!named) {
    throw new Error(`Category "${CATEGORY_NAME}" was not found. Not creating a new category.`);
  }
  const categorySlug = named.slug;

  const variants = template.sectionVariants || {};
  const entries = Object.entries(variants);
  let created = 0;
  let updated = 0;
  for (let index = 0; index < entries.length; index += 1) {
    const [sectionType, key] = entries[index];
    if (typeof key !== 'string' || !key) continue;
    const layout = {
      key,
      name: displayName(key),
      sectionType,
      sectionNumber: Number(String(key).match(/(\d+)$/)?.[1] || 1),
      scope: HOME_TYPES.has(sectionType) ? 'home' : 'page',
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
  if (!existingContent) {
    throw new Error(`CategoryContent for ${categorySlug} was not found. Not creating a new pack.`);
  }
  const previousKeys = Array.isArray(existingContent.templateKeys)
    ? existingContent.templateKeys.filter((key) => typeof key === 'string')
    : [];
  if (!previousKeys.includes(TEMPLATE_KEY)) {
    await prisma.categoryContent.update({
      where: { categorySlug },
      data: { templateKeys: [...previousKeys, TEMPLATE_KEY] },
    });
    console.log(`✓ Added ${TEMPLATE_KEY} to ${CATEGORY_NAME}`);
  } else {
    console.log(`✓ ${TEMPLATE_KEY} already listed on ${CATEGORY_NAME}`);
  }

  console.log(
    `\nDone: Home Services pest template (layouts created ${created}, updated ${updated})`,
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
