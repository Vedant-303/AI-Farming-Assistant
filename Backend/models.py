import sqlalchemy
from database import metadata

farm_status = sqlalchemy.Table(
    "farm_status",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("crop_name", sqlalchemy.String),
    sqlalchemy.Column("date_planted", sqlalchemy.String),
    sqlalchemy.Column("status", sqlalchemy.String), # e.g., "Growing", "Harvesting"
    sqlalchemy.Column("next_step", sqlalchemy.String),
    sqlalchemy.Column("last_updated", sqlalchemy.String),
)

recommendation_history = sqlalchemy.Table(
    "recommendation_history",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("type", sqlalchemy.String), # "Crop" or "Fertilizer"
    sqlalchemy.Column("result", sqlalchemy.String),
    sqlalchemy.Column("timestamp", sqlalchemy.String),
    sqlalchemy.Column("input_data", sqlalchemy.String), # JSON string
)
