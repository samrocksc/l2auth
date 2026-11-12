# Understanding Password Matching with bcrypt and Salts

I have wired up bcrypt in production more times than I can count. My first time was around 2015 on a Node.js backend for a med tech company. We grabbed `bcryptjs`, called `bcrypt.hash(password, 10)`, stored the result in the database, and called it a day. It worked. But it took me a while to really understand what that magic string `$2b$10$...` was doing under the hood.

This page is a collection of those clarifications. It is the stuff I wish someone had drawn on a whiteboard for me back then.

---

## The Hash String: Self-Contained by Design

A bcrypt hash looks like this:

```text
$2b$10$abcdefghijklmnopqrstuu/1234567890abcdefghijklmnopqrstuvwxyz
```

It is four parts packed into one string:

| Segment                 | Example           | Meaning                                                                                                                                    |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `$2b$`                  | Algorithm version | `2a`, `2b`, and `2y` are minor spec revisions. `2b` is the modern standard.                                                                |
| `$10$`                  | Cost factor       | 2^10 = 1024 rounds of the Blowfish cipher. This is the work factor, not the amount of salt. Higher means slower and harder to brute force. |
| First 22 characters     | The salt          | Random and generated fresh per password. This is why `"password"` hashed 1000 times gives 1000 different results.                          |
| Remaining 31 characters | The hash output   | The result of running the password and salt through 2^cost rounds of Blowfish.                                                             |

The elegant part: **there is no separate salt column in your database.** The salt is embedded in the hash string itself. When a user logs in and you call `bcrypt.compare()`, the library:

1. Parses `$2b$10$...` to extract the cost and the salt.
2. Runs the candidate password and extracted salt through the same Blowfish rounds.
3. Checks whether the output matches the stored hash.

One field, self-contained, zero configuration.

---

## What Salts Actually Do

The purpose of a salt is to **defeat pre-computation attacks.** If you hash passwords with plain SHA-256, an attacker with a leaked database can take the hash value and look it up in a pre-computed table to find the original password instantly.

A _rainbow table_ is exactly that: a giant pre-computed lookup table. Someone spends enormous compute up front to hash every common password (every dictionary word, every 8-character combination, and so on), then stores the results. Once they have the table, cracking a leaked hash is O(1). `5f4dcc3b5aa765d61d8327deb882cf99` turns into "password" in milliseconds.

Salts destroy this approach because the salt becomes part of the input. An attacker cannot pre-compute `SHA-256("password")`; they would need to pre-compute `SHA-256("password" + random_salt)` for _every possible salt value_. With a 22-character salt (128 bits of entropy), that is 2^128 tables. Not feasible.

This is also why, when you see a leaked database and every user has a different hash for the same password, salts are working correctly. If two users have the same hash for the same password, that is a red flag: no salt, or a static salt.

---

## Why Slow Matters: Cost Factor and Brute Force

Salts kill pre-computation (rainbow tables). The cost factor kills online brute force.

SHA-256 takes about 1 microsecond to compute. At that speed, an attacker trying common passwords against your login endpoint can blast through millions of guesses.

bcrypt with cost factor 10 takes roughly 100ms per hash. That is roughly 100,000x slower per guess. A million-guess dictionary attack that would take 1 second with SHA-256 takes over 24 hours with bcrypt at cost 10. If you bump the cost to 12 or 14, it doubles again at each step.

This is the other half of why we reach for bcrypt (or scrypt, or Argon2) over a general-purpose hash: the deliberate slowness is a feature, not a bug. You pay the 100ms cost once per login. An attacker pays it millions of times.

Tune the cost to your hardware. A common target is roughly 100ms to 250ms per hash on the server that performs logins. Re-measure when hardware changes.

---

## The Verification Flow (End To End)

Here is what happens when a user logs in, from keystroke to match or no match:

1. The user types a password into an `<input type="password">` field.
2. The browser sends it over TLS, encrypted in transit, so nobody on the wire can read it.
3. The server terminates TLS and receives the plaintext candidate password in memory, briefly.
4. The application calls `bcrypt.compare(candidatePassword, storedHash)`, usually after fetching the hash by username or email.
5. The library parses the stored hash, extracts the salt and cost, and runs the candidate through the same Blowfish rounds.
6. It returns `true` if the password matches or `false` if it does not.

For registration, the flow looks like this:

1. The user submits a password over TLS.
2. The server calls `bcrypt.hash(password, 10)`, which generates a random salt and runs the full Blowfish key derivation.
3. The resulting `$2b$10$...` string is stored in the `password_hash` column.
4. The plaintext password is discarded immediately. Never log it, never store it.

---

## Common Mistakes

- Using a fast hash such as SHA-256 or MD5 for passwords.
- Using a static salt or no salt at all.
- Comparing hashes with `===` instead of a constant-time password check.
- Logging the password or the hash in application logs.
- Forgetting to raise the cost factor as hardware gets faster.
- Truncating passwords to 72 bytes. bcrypt ignores input past 72 bytes; reject overly long passwords or pre-hash with a deliberate scheme.

## What I've Learned

The first time I wired up bcrypt, I treated it as a black box: `hash()` to save, `compare()` to check, job done. That is fine for getting things running, but understanding what is inside that `$2b$10$` string makes you appreciate the design.

The salt and cost combination covers two different attack vectors:

- **Salts** defeat rainbow table and pre-computation attacks.
- **Cost** defeats online brute force and dictionary attacks.

One hash string, both problems solved. Not bad for something that fits in a single database column.
