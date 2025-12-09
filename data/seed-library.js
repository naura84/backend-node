import mongoose, { Schema, Types } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/library_db';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // New concise schemas: Author, Book, User
  const AuthorSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    bio: String,
    nationality: String,
    birthDate: Date
  }, { collection: 'authors' });

  const BookSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    isbn: { type: String, required: true, unique: true, index: true },
    authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
    publisher: String, // simplified - no publishers collection
    summary: String,
    pages: Number,
    language: String,
    publicationDate: Date,
    tags: [String]
  }, { collection: 'books' });
  BookSchema.index({ title: 'text', summary: 'text', tags: 'text' });

  // Embedded subscription schema for users
  const SubscriptionSchema = new Schema({
    plan: String,
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    active: Boolean
  }, { _id: false });

  // Users: admin/staff/members, members have subscriptions and borrowedBooks
  const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: String,
    role: { type: String, enum: ['admin', 'member', 'librarian', 'assistant', 'manager'], required: true },
    // For members:
    subscriptions: { type: [SubscriptionSchema], default: [] },
    activeSubscription: { type: Boolean, default: false },
    // borrowed books with dates (no copies collection)
    borrowedBooks: [{
      book_id: { type: Schema.Types.ObjectId, ref: 'Book' },
      borrowedDate: Date,
      dueDate: Date,
      returned: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
  }, { collection: 'users' });

  // Create models
  const Author = mongoose.model('Author', AuthorSchema);
  const Book = mongoose.model('Book', BookSchema);
  const User = mongoose.model('User', UserSchema);

  try {
    // Drop existing data (clean seed)
    await mongoose.connection.dropDatabase();

    // Seed authors
    const authors = [
      { _id: new Types.ObjectId(), name: 'Marcus C. Hale', bio: 'Auteur de fantasy moderne.', nationality: 'FR', birthDate: new Date('1978-04-11') },
      { _id: new Types.ObjectId(), name: 'Anaïs Dupont', bio: 'Romancière contemporaine.', nationality: 'FR', birthDate: new Date('1985-01-09') },
      { _id: new Types.ObjectId(), name: 'Daniel Green', bio: 'Expert technologie & dev.', nationality: 'US', birthDate: new Date('1988-02-04') },
    ];
    await Author.insertMany(authors);

    // Seed books (referencing authors)
    const books = [
      { _id: new Types.ObjectId(), title: 'Les Chroniques de Lumo', isbn: '978-00001', authors: [authors[0]._id], publisher: 'Aurora Press', summary: 'Fantasy épique', pages: 512, language: 'FR', publicationDate: new Date('2015-10-02'), tags: ['fantasy','epic'] },
      { _id: new Types.ObjectId(), title: 'Le Monde en Péril', isbn: '978-00002', authors: [authors[1]._id], publisher: 'Éditions Soleil', summary: 'Roman contemporain', pages: 328, language: 'FR', publicationDate: new Date('2018-03-15'), tags: ['contemporary'] },
      { _id: new Types.ObjectId(), title: 'JavaScript Moderne', isbn: '978-00005', authors: [authors[2]._id], publisher: 'TechForge Publishing', summary: 'Guide pour développeurs', pages: 420, language: 'EN', publicationDate: new Date('2022-08-20'), tags: ['programming','js'] },
      { _id: new Types.ObjectId(), title: 'Contes pour Enfants', isbn: '978-00006', authors: [authors[1]._id], publisher: 'Éditions Soleil', summary: 'Histoires courtes', pages: 120, language: 'FR', publicationDate: new Date('2019-11-25'), tags: ['children'] },
    ];
    await Book.insertMany(books);

    // Seed users
    const now = new Date();
    const users = [
      // admin user
      {
        _id: new Types.ObjectId(),
        username: 'admin',
        email: 'admin@library.example',
        passwordHash: 'seed:changeme',
        role: 'admin',
        createdAt: now,
        active: true
      },
      // member with active subscription and borrowed book
      {
        _id: new Types.ObjectId(),
        username: 'claire.martin',
        email: 'claire.martin@example.com',
        passwordHash: 'seed:changeme',
        role: 'member',
        subscriptions: [
          { plan: 'Standard', startDate: new Date('2023-01-01'), endDate: new Date('2024-01-01'), createdAt: new Date('2023-01-01'), active: false },
          { plan: 'Premium', startDate: new Date('2024-02-01'), endDate: new Date('2025-02-01'), createdAt: new Date('2024-02-01'), active: true }
        ],
        activeSubscription: true,
        borrowedBooks: [
          { book_id: books[0]._id, borrowedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), returned: false }
        ],
        createdAt: now,
        active: true
      },
      // member with expired subscription and no borrowed books
      {
        _id: new Types.ObjectId(),
        username: 'paul.dupuis',
        email: 'paul.dupuis@example.com',
        passwordHash: 'seed:changeme',
        role: 'member',
        subscriptions: [
          { plan: 'Standard', startDate: new Date('2021-01-01'), endDate: new Date('2022-01-01'), createdAt: new Date('2021-01-01'), active: false }
        ],
        activeSubscription: false,
        borrowedBooks: [],
        createdAt: new Date('2021-01-01'),
        active: true
      },
      // staff user (librarian)
      {
        _id: new Types.ObjectId(),
        username: 'sophie.bernard',
        email: 'sophie.bernard@library.example',
        passwordHash: 'seed:changeme',
        role: 'librarian',
        createdAt: now,
        active: true
      }
    ];
    await User.insertMany(users);

    // Ensure indexes
    await Book.collection.createIndex({ isbn: 1 }, { unique: true }).catch(() => {});
    await Book.collection.createIndex({ title: 'text', summary: 'text', tags: 'text' }).catch(() => {});
    await Author.collection.createIndex({ name: 1 }).catch(() => {});
    await User.collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await User.collection.createIndex({ username: 1 }, { unique: true }).catch(() => {});
    await User.collection.createIndex({ role: 1 }).catch(() => {});

    console.log('Seeding complete: inserted authors, books, users (with roles, subscriptions and borrowedBooks).');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
