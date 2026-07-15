import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv/dist/2020.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true, strict: false });

// Load schemas
const courseSchemaPath = path.resolve(__dirname, '../../Slide/swd392-brilliant/course.schema.json');
const lessonSchemaPath = path.resolve(__dirname, '../lesson.schema.json');

const courseSchema = JSON.parse(fs.readFileSync(courseSchemaPath, 'utf8'));
const lessonSchema = JSON.parse(fs.readFileSync(lessonSchemaPath, 'utf8'));

// Compile validators
const validateCourse = ajv.compile(courseSchema);
const validateLesson = ajv.compile(lessonSchema);

let hasErrors = false;

// 1. Validate manifest.json
const manifestPath = path.resolve(__dirname, '../src/content/manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Error: manifest.json not found!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const isManifestValid = validateCourse(manifest);
if (!isManifestValid) {
  console.error('Validation failed for manifest.json:');
  console.error(validateCourse.errors);
  hasErrors = true;
} else {
  console.log('✓ manifest.json is valid.');
}

// 2. Validate lessons JSONs
const lessonsDir = path.resolve(__dirname, '../src/content/lessons');
if (fs.existsSync(lessonsDir)) {
  const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json'));
  for (const file of lessonFiles) {
    const lessonPath = path.join(lessonsDir, file);
    const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
    const isLessonValid = validateLesson(lesson);
    if (!isLessonValid) {
      console.error(`Validation failed for lesson: ${file}`);
      console.error(validateLesson.errors);
      hasErrors = true;
    } else {
      console.log(`✓ Lesson ${file} is valid.`);
    }
  }
} else {
  console.error('Error: lessons directory not found!');
  hasErrors = true;
}

// 3. Validate review JSONs
const reviewsDir = path.resolve(__dirname, '../src/content/reviews');
if (fs.existsSync(reviewsDir)) {
  const reviewFiles = fs.readdirSync(reviewsDir).filter(file => file.endsWith('.json'));
  for (const file of reviewFiles) {
    const reviewPath = path.join(reviewsDir, file);
    try {
      const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
      if (!review.id || !review.title || !Array.isArray(review.questions)) {
        console.error(`Validation failed for review: ${file}. Missing basic fields.`);
        hasErrors = true;
      } else {
        console.log(`✓ Review ${file} is valid.`);
      }
    } catch (e) {
      console.error(`Error parsing review: ${file}`, e);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error('\n❌ Some JSON files failed validation!');
  process.exit(1);
} else {
  console.log('\n✅ All content files are valid!');
  process.exit(0);
}
