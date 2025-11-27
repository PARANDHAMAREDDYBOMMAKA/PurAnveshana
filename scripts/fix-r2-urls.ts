import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixR2Urls() {
  console.log('Finding images with incorrect R2 URLs...')

  const images = await prisma.siteImage.findMany({
    where: {
      r2Url: {
        contains: 'r2.cloudflarestorage.com'
      }
    }
  })

  console.log(`Found ${images.length} images with incorrect URLs`)

  for (const image of images) {
    if (image.r2Url && image.r2Key) {
      const newUrl = `https://pub-fd847e78f5c44470828fed94407dd880.r2.dev/${image.r2Key}`

      await prisma.siteImage.update({
        where: { id: image.id },
        data: { r2Url: newUrl }
      })

      console.log(`Fixed: ${image.id}`)
      console.log(`  Old: ${image.r2Url}`)
      console.log(`  New: ${newUrl}`)
    }
  }

  console.log('Done!')
  await prisma.$disconnect()
}

fixR2Urls().catch(console.error)
