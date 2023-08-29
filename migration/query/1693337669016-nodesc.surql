DEFINE NAMESPACE nnry;
DEFINE DATABASE nnry;

DEFINE TABLE manga SCHEMAFULL;

DEFINE FIELD mangadex_id ON manga TYPE string
  ASSERT $value != NONE;
DEFINE FIELD original_lang ON manga TYPE string
  VALUE $value OR 'ja';
DEFINE FIELD updated_at ON manga TYPE datetime
  VALUE $value OR time::now();
DEFINE FIELD created_at ON manga TYPE datetime
  VALUE $value OR time::now();
