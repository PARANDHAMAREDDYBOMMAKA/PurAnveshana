import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRoles() {
  try {
    const users = await prisma.profile.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        _count: {
          select: {
            heritageSites: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('\n=== User Roles in Database ===\n')
    users.forEach((user) => {
      console.log(`Email: ${user.email}`)
      console.log(`Role: "${user.role}" (type: ${typeof user.role})`)
      console.log(`Heritage Sites: ${user._count.heritageSites}`)
      console.log(`ID: ${user.id}`)
      console.log('---')
    })

    console.log(`\nTotal users: ${users.length}`)
    console.log(`Admin users: ${users.filter((u) => u.role === 'admin').length}`)
    console.log(`Regular users: ${users.filter((u) => u.role === 'user').length}`)

    // Check for any unusual role values
    const roleSet = new Set(users.map((u) => u.role))
    console.log(`\nUnique roles found: ${Array.from(roleSet).join(', ')}`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoles()
