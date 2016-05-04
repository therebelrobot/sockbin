FROM node:6-onbuild
MAINTAINER Trent Oswald (@therebelrobot) <trentoswald@therebelrobot.com>
RUN npm install --production

EXPOSE 4080

ENV OVERRIDE docker-override

CMD ["npm", "start"]
