const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'library_db';

async function seed() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Drop existing data (clean seed)
    await db.dropDatabase();

    // Create base entities
    const authors = [
      { _id: new ObjectId(), name: 'Marcus C. Hale', bio: 'Auteur de fantasy moderne.', nationality: 'FR', birthDate: new Date('1978-04-11') },
      { _id: new ObjectId(), name: 'Anaïs Dupont', bio: 'Romancière contemporaine.', nationality: 'FR', birthDate: new Date('1985-01-09') },
      { _id: new ObjectId(), name: 'Lucas Martins', bio: 'Historien et essayiste.', nationality: 'PT', birthDate: new Date('1970-06-21') },
      { _id: new ObjectId(), name: 'Sarah Li', bio: 'Science writer and educator.', nationality: 'CN', birthDate: new Date('1982-11-03') },
      { _id: new ObjectId(), name: 'Emma Novak', bio: 'Auteur jeunesse.', nationality: 'CZ', birthDate: new Date('1990-05-17') },
      { _id: new ObjectId(), name: 'Daniel Green', bio: 'Expert technologie & dev.', nationality: 'US', birthDate: new Date('1988-02-04') },
      { _id: new ObjectId(), name: 'Omar Haddad', bio: 'Poète contemporain.', nationality: 'MA', birthDate: new Date('1976-12-28') },
    ];

    const publishers = [
      { _id: new ObjectId(), name: 'Aurora Press', address: '10 rue de la Lumière, Paris', email: 'contact@aurorapress.fr', website: 'https://aurorapress.example' },
      { _id: new ObjectId(), name: 'Éditions Soleil', address: '4 avenue du Midi, Lyon', email: 'info@editionssoleil.fr', website: 'https://editionssoleil.example' },
      { _id: new ObjectId(), name: 'TechForge Publishing', address: '100 Tech Road, SF', email: 'hello@techforge.example', website: 'https://techforge.example' },
      { _id: new ObjectId(), name: 'Old Harbour Books', address: 'Harbour St. 12', email: 'books@oldharbour.example', website: 'https://oldharbour.example' },
    ];

    const categories = [
      { _id: new ObjectId(), name: 'Fiction', description: 'Romans et nouvelles' },
      { _id: new ObjectId(), name: 'Science', description: 'Vulgarisation scientifique' },
      { _id: new ObjectId(), name: 'History', description: 'Histoire et biographies' },
      { _id: new ObjectId(), name: 'Technology', description: 'Informatique et technologie' },
      { _id: new ObjectId(), name: 'Children', description: 'Livres pour enfants' },
      { _id: new ObjectId(), name: 'Poetry', description: 'Recueils poétiques' },
    ];

    const branches = [
      { _id: new ObjectId(), name: 'Central Library', address: '1 Main St', phone: '+33 1 23 45 00 00', openingHours: 'Mon-Fri 9-18' },
      { _id: new ObjectId(), name: 'Riverside Branch', address: '8 River Rd', phone: '+33 1 23 45 11 11', openingHours: 'Tue-Sat 10-17' },
      { _id: new ObjectId(), name: 'Northside Branch', address: '23 North Ave', phone: '+33 1 23 45 22 22', openingHours: 'Mon-Sat 9-18' },
    ];

    // Insert base collections
    await db.collection('authors').insertMany(authors);
    await db.collection('publishers').insertMany(publishers);
    await db.collection('categories').insertMany(categories);
    await db.collection('branches').insertMany(branches);

    // Books
    const books = [
      { _id: new ObjectId(), title: 'Les Chroniques de Lumo', isbn: '978-00001', authors: [authors[0]._id], publisher_id: publishers[0]._id, category_ids: [categories[0]._id], summary: 'Fantasy épique', pages: 512, language: 'FR', publicationDate: new Date('2015-10-02'), tags: ['fantasy', 'epic'] },
      { _id: new ObjectId(), title: 'Le Monde en Péril', isbn: '978-00002', authors: [authors[1]._id], publisher_id: publishers[1]._id, category_ids: [categories[0]._id, categories[2]._id], summary: 'Roman contemporain', pages: 328, language: 'FR', publicationDate: new Date('2018-03-15'), tags: ['contemporary'] },
      { _id: new ObjectId(), title: 'Histoire du Commerce Maritime', isbn: '978-00003', authors: [authors[2]._id], publisher_id: publishers[3]._id, category_ids: [categories[2]._id], summary: 'Essai historique', pages: 412, language: 'EN', publicationDate: new Date('2011-09-10'), tags: ['history'] },
      { _id: new ObjectId(), title: 'Physique pour Tous', isbn: '978-00004', authors: [authors[3]._id], publisher_id: publishers[0]._id, category_ids: [categories[1]._id], summary: 'Introduction à la physique', pages: 300, language: 'FR', publicationDate: new Date('2020-06-01'), tags: ['science'] },
      { _id: new ObjectId(), title: 'JavaScript Moderne', isbn: '978-00005', authors: [authors[5]._id], publisher_id: publishers[2]._id, category_ids: [categories[3]._id], summary: "Guide pour développeurs", pages: 420, language: 'EN', publicationDate: new Date('2022-08-20'), tags: ['programming','js'] },
      { _id: new ObjectId(), title: 'Contes pour Enfants', isbn: '978-00006', authors: [authors[4]._id], publisher_id: publishers[1]._id, category_ids: [categories[4]._id], summary: 'Histoires courtes', pages: 120, language: 'FR', publicationDate: new Date('2019-11-25'), tags: ['children'] },
      { _id: new ObjectId(), title: 'Rêves en Vers', isbn: '978-00007', authors: [authors[6]._id], publisher_id: publishers[3]._id, category_ids: [categories[5]._id], summary: 'Poésie contemporaine', pages: 88, language: 'FR', publicationDate: new Date('2016-02-02'), tags: ['poetry'] },
      { _id: new ObjectId(), title: 'Algorithmes & Structures', isbn: '978-00008', authors: [authors[5]._id], publisher_id: publishers[2]._id, category_ids: [categories[3]._id], summary: 'Algo avancé', pages: 680, language: 'EN', publicationDate: new Date('2017-05-14'), tags: ['algorithms'] },
      { _id: new ObjectId(), title: 'Jardin Secret', isbn: '978-00009', authors: [authors[1]._id], publisher_id: publishers[0]._id, category_ids: [categories[0]._id], summary: 'Roman d\'introspection', pages: 256, language: 'FR', publicationDate: new Date('2013-07-07'), tags: ['fiction'] },
      { _id: new ObjectId(), title: 'Le Ciel et les Étoiles', isbn: '978-00010', authors: [authors[3]._id], publisher_id: publishers[0]._id, category_ids: [categories[1]._id], summary: 'Astronomie accessible', pages: 240, language: 'FR', publicationDate: new Date('2021-01-21'), tags: ['astronomy'] },
      { _id: new ObjectId(), title: 'Guide du Développeur Moderne', isbn: '978-00011', authors: [authors[5]._id], publisher_id: publishers[2]._id, category_ids: [categories[3]._id], summary: 'Bonnes pratiques', pages: 360, language: 'EN', publicationDate: new Date('2020-09-10'), tags: ['dev','practices'] },
      { _id: new ObjectId(), title: 'La Route du Sel', isbn: '978-00012', authors: [authors[2]._id], publisher_id: publishers[3]._id, category_ids: [categories[2]._id], summary: 'Voyage et histoire', pages: 480, language: 'EN', publicationDate: new Date('2009-12-01'), tags: ['history','travel'] },
    ];

    await db.collection('books').insertMany(books);

    // Populate copies (inventory): multiple copies per book across branches
    const copies = [];
    const getCopyId = (bIdx, n) => `${bIdx + 1}-${n + 1}`; // simple string id for copyNumber
    books.forEach((book, bIdx) => {
      // 2 to 4 copies per book
      const copiesCount = 2 + (bIdx % 3);
      for (let i = 0; i < copiesCount; i++) {
        const branch = branches[(bIdx + i) % branches.length];
        copies.push({
          _id: new ObjectId(),
          book_id: book._id,
          branch_id: branch._id,
          copyNumber: getCopyId(bIdx, i),
          status: 'available',
          addedDate: new Date('2021-01-01'),
          location: `Shelf ${String.fromCharCode(65 + (bIdx % 6))}${i + 1}`,
        });
      }
    });

    await db.collection('copies').insertMany(copies);
    // Indexes for copies
    await db.collection('copies').createIndex({ book_id: 1, copyNumber: 1 }, { unique: true });

    // Members
    const members = [
      { _id: new ObjectId(), firstName: 'Claire', lastName: 'Martin', email: 'claire.martin@example.com', phone: '+33 6 11 22 33 44', address: '5 rue Blanche', memberSince: new Date('2019-03-03'), active: true, finesBalance: 0.00 },
      { _id: new ObjectId(), firstName: 'Paul', lastName: 'Dupuis', email: 'paul.dupuis@example.com', phone: '+33 6 22 33 44 55', address: '12 rue du Parc', memberSince: new Date('2020-07-15'), active: true, finesBalance: 5.0 },
      { _id: new ObjectId(), firstName: 'Ines', lastName: 'Rossi', email: 'ines.rossi@example.com', phone: '+33 6 33 44 55 66', address: '20 avenue des Fleurs', memberSince: new Date('2018-11-09'), active: true, finesBalance: 0.0 },
      { _id: new ObjectId(), firstName: 'Marc', lastName: 'Perez', email: 'marc.perez@example.com', phone: '+33 6 44 55 66 77', address: '40 rue Victor', memberSince: new Date('2021-02-01'), active: true, finesBalance: 12.5 },
      { _id: new ObjectId(), firstName: 'Amina', lastName: 'Elk', email: 'amina.elk@example.com', phone: '+33 6 55 66 77 88', address: '88 rue Nationale', memberSince: new Date('2017-06-20'), active: true, finesBalance: 0.0 },
      { _id: new ObjectId(), firstName: 'Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@example.com', phone: '+33 6 66 77 88 99', address: '10 impasse des Roses', memberSince: new Date('2022-05-01'), active: true, finesBalance: 0.0 },
    ];

    await db.collection('members').insertMany(members);
    await db.collection('members').createIndex({ email: 1 }, { unique: true });

    // Staff
    const staff = [
      { _id: new ObjectId(), firstName: 'Sophie', lastName: 'Bernard', role: 'librarian', email: 'sophie.bernard@library.example', phone: '+33 1 55 66 77 88', branch_id: branches[0]._id },
      { _id: new ObjectId(), firstName: 'Julien', lastName: 'Morel', role: 'assistant', email: 'julien.morel@library.example', phone: '+33 1 55 66 77 99', branch_id: branches[1]._id },
      { _id: new ObjectId(), firstName: 'Lea', lastName: 'Fontaine', role: 'manager', email: 'lea.fontaine@library.example', phone: '+33 1 55 66 77 55', branch_id: branches[0]._id },
    ];

    await db.collection('staff').insertMany(staff);

    // Users collection: comptes d'authentification (référence staff_id/member_id) avec rôle
    const users = [
      // system admin (non lié à un profile staff / member)
      { _id: new ObjectId(), username: 'admin', email: 'admin@library.example', passwordHash: 'seed:changeme', role: 'admin', createdAt: new Date(), active: true },
      // staff as users
      { _id: new ObjectId(), username: 'sophie.bernard', email: staff[0].email, passwordHash: 'seed:changeme', role: 'librarian', staff_id: staff[0]._id, createdAt: new Date(), active: true },
      { _id: new ObjectId(), username: 'julien.morel', email: staff[1].email, passwordHash: 'seed:changeme', role: 'assistant', staff_id: staff[1]._id, createdAt: new Date(), active: true },
      { _id: new ObjectId(), username: 'lea.fontaine', email: staff[2].email, passwordHash: 'seed:changeme', role: 'manager', staff_id: staff[2]._id, createdAt: new Date(), active: true },
      // members as users
      { _id: new ObjectId(), username: 'claire.martin', email: members[0].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[0]._id, createdAt: new Date(), active: members[0].active },
      { _id: new ObjectId(), username: 'paul.dupuis', email: members[1].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[1]._id, createdAt: new Date(), active: members[1].active },
      { _id: new ObjectId(), username: 'ines.rossi', email: members[2].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[2]._id, createdAt: new Date(), active: members[2].active },
      { _id: new ObjectId(), username: 'marc.perez', email: members[3].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[3]._id, createdAt: new Date(), active: members[3].active },
      { _id: new ObjectId(), username: 'amina.elk', email: members[4].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[4]._id, createdAt: new Date(), active: members[4].active },
      { _id: new ObjectId(), username: 'kenji.tanaka', email: members[5].email, passwordHash: 'seed:changeme', role: 'member', member_id: members[5]._id, createdAt: new Date(), active: members[5].active },
    ];

    await db.collection('users').insertMany(users);
    // Indexes pour users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });

    // Loans: take some copies and create loans
    const now = new Date();
    const loans = [
      // current loan, due soon
      { _id: new ObjectId(), copy_id: copies[0]._id, book_id: copies[0].book_id, member_id: members[0]._id, staff_id: staff[0]._id, loanDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), returnDate: null, status: 'borrowed', fineApplied: 0 },
      // returned loan
      { _id: new ObjectId(), copy_id: copies[1]._id, book_id: copies[1].book_id, member_id: members[1]._id, staff_id: staff[1]._id, loanDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000), returnDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), status: 'returned', fineApplied: 0 },
      // overdue loan
      { _id: new ObjectId(), copy_id: copies[2]._id, book_id: copies[2].book_id, member_id: members[3]._id, staff_id: staff[0]._id, loanDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), returnDate: null, status: 'overdue', fineApplied: 6.25 },
      // current loan
      { _id: new ObjectId(), copy_id: copies[5]._id, book_id: copies[5].book_id, member_id: members[2]._id, staff_id: staff[2]._id, loanDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), returnDate: null, status: 'borrowed', fineApplied: 0 },
      // returned with fine
      { _id: new ObjectId(), copy_id: copies[6]._id, book_id: copies[6].book_id, member_id: members[3]._id, staff_id: staff[1]._id, loanDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000), returnDate: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000), status: 'returned', fineApplied: 12.50 },
      // current loan
      { _id: new ObjectId(), copy_id: copies[8]._id, book_id: copies[8].book_id, member_id: members[4]._id, staff_id: staff[0]._id, loanDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000), returnDate: null, status: 'borrowed', fineApplied: 0 },
      // reserved but not picked (loan created as reserved)
      { _id: new ObjectId(), copy_id: copies[9]._id, book_id: copies[9].book_id, member_id: members[5]._id, staff_id: staff[2]._id, loanDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), returnDate: null, status: 'borrowed', fineApplied: 0 },
    ];

    await db.collection('loans').insertMany(loans);

    // Update copy statuses based on loans
    const borrowedCopyIds = loans.filter(l => l.status === 'borrowed' || l.status === 'overdue').map(l => l.copy_id);
    await db.collection('copies').updateMany({ _id: { $in: borrowedCopyIds } }, { $set: { status: 'borrowed' } });

    // Reservations
    const reservations = [
      { _id: new ObjectId(), book_id: books[0]._id, member_id: members[1]._id, branch_id: branches[0]._id, reservedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: 'active', expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[3]._id, member_id: members[2]._id, branch_id: branches[2]._id, reservedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), status: 'ready', expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[5]._id, member_id: members[0]._id, branch_id: branches[1]._id, reservedDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), status: 'cancelled', expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[9]._id, member_id: members[4]._id, branch_id: branches[0]._id, reservedDate: new Date(now.getTime()), status: 'active', expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) },
    ];
    await db.collection('reservations').insertMany(reservations);

    // Fines
    const fines = [
      { _id: new ObjectId(), member_id: members[3]._id, loan_id: loans[2]._id, amount: 6.25, paid: false, dateIssued: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000), reason: 'Overdue return' },
      { _id: new ObjectId(), member_id: members[3]._id, loan_id: loans[5]._id, amount: 12.5, paid: true, dateIssued: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000), datePaid: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), reason: 'Late return' },
    ];

    await db.collection('fines').insertMany(fines);

    // Reviews
    const reviews = [
      { _id: new ObjectId(), book_id: books[0]._id, member_id: members[0]._id, rating: 5, comment: 'Magnifique univers.', date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[4]._id, member_id: members[2]._id, rating: 4, comment: 'Très utile pour débuter.', date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[6]._id, member_id: members[5]._id, rating: 3, comment: 'Poèmes agréables', date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[2]._id, member_id: members[1]._id, rating: 4, comment: 'Bon niveau historique.', date: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000) },
      { _id: new ObjectId(), book_id: books[8]._id, member_id: members[4]._id, rating: 5, comment: 'Profond et touchant.', date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) },
    ];

    await db.collection('reviews').insertMany(reviews);

    // Indexes for books
    await db.collection('books').createIndex({ isbn: 1 }, { unique: true });
    await db.collection('books').createIndex({ title: 'text', summary: 'text', tags: 'text' });

    // Index for members (unique email)
    await db.collection('members').createIndex({ email: 1 }, { unique: true });

    console.log('Seeding complete: inserted authors, publishers, categories, branches, books, copies, members, staff, loans, reservations, fines, reviews.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
