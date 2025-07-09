#APP
PORT=5000
HOST=127.0.0.1
NAME=BASE_TEMPLETE
PROJECT_NAME=Silla_Like
VERSION=v1
PROJECT_NAME=Sill_link
BASE_URL=http://localhost:5000

NODE_ENV=development

#POSTGRES_DATA_BASE
DB_PORT=5432
DB_HOST=localhost
DB_PASSWORD=kutaibaAlnizaemy
DB_USERNAME=postgres
DB_NAME=nest-ecommerce
DB_URL=postgresql://postgres:kutaibaAlnizaemy@localhost:5432/nest-ecommerce?schema=public

# MONGODB_DATA_BASE
MONGODB_PORT=27017
MONGODB_HOST=mongodb
#MONGODB_PASSWORD=silla_link
#MONGODB_USERNAME=silla_link
MONGODB_NAME=silla_link

#JWT
JWT_ACCESS_SECRET=thisIsJwtSecret
JWT_REFRESH_SECRET=thisIsJwtRefreshTekn
JWT_EXPIRED_ACCESS=10d
JWT_EXPIRED_REFRESH=100d
JWT_CHECK_EMAIL_EXPIRED=15m
REFRESH_TOKEN_REDIS_EXPIERD=123456676

#Mail Configuration
# Choose email provider: 'gmail', 'resend', or 'mailersend'
EMAIL_PROVIDER=resend

# Gmail SMTP Configuration (Recommended for development)
GMAIL_USER=sillalink1@gmail.com
GMAIL_APP_PASSWORD=bbgqktryackzvowd
# To get Gmail App Password:
# 1. Enable 2FA on your Gmail account
# 2. Go to Google Account settings > Security > 2-Step Verification > App passwords
# 3. Generate an app password for "Mail"

# Resend Configuration (Recommended for production)
RESEND_API_KEY=re_gywvSs8Z_FzQvLMQykuKSP3UQzEzCsNpW
RESEND_FROM_EMAIL=onboarding@resend.dev
# To get Resend API key:
# 1. Sign up at https://resend.com (3,000 emails/month free)
# 2. Go to API Keys section and create a new key

# Legacy MailerSend Configuration (has trial limitations)
MAIL_HOST=smtp.mailersend.net
MAIL_PORT=2525
MAIL_USER=MS_t12sDE@test-86org8e872kgew13.mlsender.net
MAIL_PASS=mssp.3tSrcBG.neqvygm75d8g0p7w.5uUjocP
MAIL_FROM_NAME='Silla Link'

#Rides
REDIS_NAME=silla_like
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DATABASE_INDEX=9
REDIS_PASSWORD=
REDIS_TIME_TO_LIVE=2592000000

#File Upload
MAX_FILE_SIZE=5242880
OTP_TIME=300000
