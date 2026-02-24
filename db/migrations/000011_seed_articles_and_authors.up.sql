-- Insert authors into users
INSERT INTO users (
    id, email, password, role, first_name, last_name, is_active, created_at, updated_at
) VALUES
      (1000,  'takeda@example.com', 'hashed_password_1', 'lawyer', '武田', '弁護士', true, '2023-03-01', '2023-10-15'),
      (1001, 'sato.miki@example.com', 'hashed_password_2', 'lawyer', '佐藤', '美紀', true, '2023-05-15', '2023-12-10'),
      (1002, 'suzuki@example.com', 'hashed_password_3', 'lawyer', '鈴木', '健太', true, '2023-04-10', '2023-11-25');

-- Insert articles
INSERT INTO articles (
    id, slug, title, category, summary, content, thumbnail,
    author_id, published_at, status, created_at, updated_at
) VALUES
-- Article 1
(1000, 'understanding-contract-law',
 '労働問題の解決法～働く人を守るために知っておくべきこと～',
 'employment',
 '職場でのトラブルは、誰にでも起こりうる身近な問題です。上司からのパワハラ、長時間労働、未払い残業代、不当解雇など、労働者の権利が侵害されるケースは少なくありません。',
 $$<p>職場でのトラブルは、誰にでも起こりうる身近な問題です。...（省略）</p>$$,
 'https://blog.ipleaders.in/wp-content/uploads/2020/08/unit-5-aspects-of-contract-law-negligence-in-business-assignment-1.jpg',
 1000, '2024-03-15', 'published', '2024-03-10', '2024-03-15'),

-- Article 2
(1001, 'family-law-essentials',
 '知的財産権の保護について ～アイデアを守り、ビジネスを支えるために～',
 'corporate',
 '私たちが日常的に目にする商品、サービス、デザイン、ロゴ、音楽、ソフトウェアなどには、誰かの「アイデア」や「創意工夫」が込められています。',
 $$<p>私たちが日常的に目にする商品、サービス、デザイン、ロゴ、音楽、ソフトウェアなどには、...（省略）</p>$$,
 'https://www.familylawsandiego.com/images/blog/iStock-155391642.1).jpg',
 1001, '2024-02-20', 'published', '2024-02-15', '2024-02-20'),

-- Article 3
(1002, 'intellectual-property-rights',
 '国際取引における法的リスク管理 ～グローバルビジネスを守るために～',
 'corporate',
 'グローバル化が進む現代において、海外企業との取引は多くの企業にとって重要なビジネスチャンスとなっています。',
 $$<p>グローバル化が進む現代において、海外企業との取引は...（省略）</p>$$,
 'https://image3.luatvietnam.vn/uploaded/images/original/2024/07/26/assessing-intellectual-property-rights-infringement-in-vietnam-2_2607160625.jpg',
 1002, '2024-01-10', 'published', '2024-01-05', '2024-01-10');
