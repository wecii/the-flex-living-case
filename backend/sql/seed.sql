INSERT INTO properties (slug, name)
VALUES
  ('shoreditch-heights', '2B N1 A - 29 Shoreditch Heights'),
  ('kensington-loft', '1A Kensington Loft')
ON CONFLICT DO NOTHING;
INSERT INTO reviews (property_id, source, external_id, guest_name, rating, comment, category_scores, submitted_at, status)
SELECT p.id, 'hostaway', 'demo1', 'John Doe', 9.5, 'Amazing place!',
       '{"cleanliness":10,"communication":9,"value":9}'::jsonb, NOW() - INTERVAL '10 days', 'approved'
FROM properties p WHERE p.slug='shoreditch-heights'
ON CONFLICT DO NOTHING;