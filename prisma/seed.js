import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await createUser();
  await createBook(
    "A Man and his Cat vol.1",
    "Umi",
    "Sakurai",
    "https://cdn.thestorygraph.com/6zkq2khxeygh4a3ic8yil2o8z0pd",
    145,
    "Square Enix Manga & Books",
    2020,
    "read"
  );
  await createBook(
    "The House in the Cerulean Sea",
    "TJ",
    "Klune",
    "https://cdn.thestorygraph.com/v5kdnfpfech11x14nxw2vn6d9yex",
    398,
    "Tor Books",
    2020,
    "tbr"
  );
  await createBook(
    "Love in the times of serial killers",
    "Alicia",
    "Thompson",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.CKSt4f0FJioBpoga9CN6mQAAAA%26pid%3DApi&f=1&ipt=19a420fa9eba97c16c59b32882e82387116871fd7246d1f1065d75279091cc9b&ipo=images",
    337,
    "?",
    2023,
    "reading"
  );
  await createBook(
    "The Beautiful Ones",
    "Silvia",
    "Moreno-Garcia",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.zOfVx3YBe-N6tLUM6DKLwAHaLW%26pid%3DApi&f=1&ipt=21cfcc2adda96c3805815429332a093ddc5b34344a05b479e80dbdb0ae15a475&ipo=images",
    292,
    "Jo Fletcher Books",
    2021,
    "reading"
  );
  await createBook(
    "Belladonna",
    "Adalyn",
    "Grace",
    "https://cdn.thestorygraph.com/vc0dpn5mpdadav77149xs0p6p5g4",
    416,
    "?",
    2022,
    "tbr"
  );

  await createRating();

  // await reviewBook("cutest book ever", 1);

  await createTags();
  process.exit(0);
}

// TODO: encrypt passwords
async function createUser() {
  const password = "Testpassword1!";
  const user = await prisma.user.create({
    data: {
      email: "testing@test.com",
      password: await bcrypt.hash(password, 8),
      // password,
      profile: {
        create: {
          firstName: "Frank",
          lastName: "Reeds",
          bio: "Hello, booksta!",
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log("user created", user);

  return user;
}

async function createBook(
  title,
  authorFirstName,
  authorLastName,
  coverUrl,
  numPages,
  publisher,
  yearPublished,
  ReadStatus
) {
  const book = await prisma.book.create({
    data: {
      title,
      authorFirstName,
      authorLastName,
      coverUrl,
      numPages,
      publisher,
      yearPublished,
      ReadStatus,
    },
  });
  console.log("Book created:", book);
  return book;
}

async function createTags() {
  const tags = await prisma.tags.createMany({
    data: [
      { tag: "fiction" },
      { tag: "non-fiction" },
      { tag: "humour" },
      { tag: "lighthearted" },
      { tag: "mystery" },
      { tag: "thriller" },
      { tag: "true-crime" },
      { tag: "lgbtq+" },
      { tag: "romance" },
      { tag: "contemporary" },
      { tag: "historical" },
      { tag: "science-fiction" },
      { tag: "young adult" },
      { tag: "self help" },
      { tag: "psychology" },
      { tag: "memoir" },
    ],
  });

  return tags;
}

// TODO:
// review on book by Frank
// async function reviewBook(review, bookId) {
// const bookReview = await prisma.reviews.create({
//   data: {
//     review,
//     userId: {
//       connectOrCreate: {
//         where: {
//           userId: 1
//         }
//       }
//     },
//     bookId: {
//       connectOrCreate: {
//         where: {
//          bookId,
//         },
//       },
//     },

//   },
// });

// return bookReview
// }
//Tag on Book

//Rating on book
async function createRating() {
  const ratings = await prisma.ratings.createMany({
    data: [
      { rating: 1 },
      { rating: 2 },
      { rating: 3 },
      { rating: 4 },
      { rating: 5 },
    ],
  });

  return ratings;
}

seed()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
