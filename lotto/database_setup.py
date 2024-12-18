import sqlite3

# התחברות לבסיס הנתונים או יצירה שלו אם לא קיים
conn = sqlite3.connect('lotto.db')
cursor = conn.cursor()

# יצירת טבלה למשתתפים אם היא לא קיימת
cursor.execute('''
CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    numbers TEXT NOT NULL,
    strong_number INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    confirm_payment BOOLEAN NOT NULL
)
''')

# שמירת השינויים וסגירת החיבור
conn.commit()
conn.close()

print("בסיס הנתונים והטבלה נוצרו בהצלחה!")
