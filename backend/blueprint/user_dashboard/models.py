from backend import db
from sqlalchemy import String, Boolean, Integer, ForeignKey
from enum import Enum

class CyberBadges(Enum):
    ORBITAL_UPTIME_BADGE = [
        {
            'Low Orbit':10,
            'Geostationary': 30,

        },
        {

        },]