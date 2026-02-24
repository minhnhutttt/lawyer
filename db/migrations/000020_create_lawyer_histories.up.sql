CREATE TABLE IF NOT EXISTS lawyer_histories (
    id SERIAL PRIMARY KEY,
    lawyer_id INTEGER NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    changes JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lawyer_histories_lawyer_id ON lawyer_histories(lawyer_id);
