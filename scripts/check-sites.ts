import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSites() {
  try {
    const sites = await prisma.heritageSite.findMany({
      include: {
        profile: {
          select: {
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('\n=== Heritage Sites in Database ===\n')
    sites.forEach((site, index) => {
      console.log(`${index + 1}. ${site.title}`)
      console.log(`   Owner: ${site.profile.email} (${site.profile.role})`)
      console.log(`   User ID: ${site.userId}`)
      console.log(`   Images: ${site._count.images}`)
      console.log(`   Created: ${site.createdAt}`)
      console.log('---')
    })

    console.log(`\nTotal heritage sites: ${sites.length}`)

    // Group by owner
    const sitesByOwner = sites.reduce((acc: any, site) => {
      const email = site.profile.email
      if (!acc[email]) acc[email] = []
      acc[email].push(site.title)
      return acc
    }, {})

    console.log('\n=== Sites by Owner ===')
    Object.entries(sitesByOwner).forEach(([email, titles]) => {
      console.log(`${email}: ${(titles as string[]).length} site(s)`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSites()
