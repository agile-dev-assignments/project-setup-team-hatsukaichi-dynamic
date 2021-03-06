# TV Tracker

[![Build Status](https://travis-ci.com/agile-dev-assignments/project-setup-team-hatsukaichi-dynamic.svg?branch=master)](https://travis-ci.com/agile-dev-assignments/project-setup-team-hatsukaichi-dynamic)

## Project Description

TV Tracker is an easy, intuitive way to keep track of the shows and movies you're watching across platforms. Given that some shows are only available on specific platforms, it can be hard to figure out where you're watching your content.
That's where we come in. In TV Tracker, you can categorize your media--whether it be a show you're watching right now or a movie you watched a long time ago--by platform, filter by platform, and share a link to your profile with your friends.
Our system allows for quick access to the basic details for just about every movie or show under the sun. With TV Tracker, it's never been easier to track your media.

### Team Members

- [Lev Bernstein](https://github.com/LevBernstein)
- [Samantha Eng](https://github.com/sam-eng)
- [Mason Kalaty](https://github.com/Gkal2000)
- [Almazhan Kapan](https://github.com/almazhankapan)
- [Ben Kaplan](https://github.com/benrkaplan)
- [Nicole Stovall](https://github.com/stovalln21)

## Product Vision Statement

### Home Page and Navigation

- Landing page, terms of service
- Menu bar for easy access to other areas of the site

### Account Creation + Management

- Sign up and log into accounts
- Share profile with others
- Change username and password

### Show Searching + Addition

- Search and add shows to status lists (watching, planning, completed)
- Mark and edit episode progress and the platform the show is being watched on
- Filter shows on lists by platform

## Project History

All of us enjoy TV, but it can be hard to figure out where you are in each show you're watching, given how distributed content is across platforms.
When all of us ended up in the Agile Development class, we were drawn to Sam's proposal for a method of dealing with cross-platform content organization.
As such, we decided to make TV Tracker. We realized that there is a need for an easy system of organization and classification for TV and movies; that's where we come in.
That's how TV Tracker was born.

## Contributing and More

If you would like to contribute to this project, please take a look at the [CONTRIBUTING.md](CONTRIBUTING.md) file and follow the instructions there.

You can take a look at the original project proposal [here](https://github.com/agile-dev-assignments/project-proposal-sme388).

## Building and Testing

Fork (if intending to make changes) or clone this repository.

### Building 

To start the front end of the project, navigate to the front-end folder and run the following commands in the command line:

> npm install

In front-end, create a file named '.env' with the following contents:

> REACT_APP_MOCKAROO_KEY=your_API_key

Replace ``your_API_key`` with your Mockaroo API key. Save the file and close it.

For example, if your API key is 123456, the line would read:

> REACT_APP_MOCKAROO_KEY=123456

Then, in front-end, run:

> npm start

To start the back end of the project, navigate to the back-end folder and run the following commands in the command line:

> npm install

In back-end, create a file named '.env' with the following contents:

> API_KEY_MOCKAROO=your_API_key

Replace ``your_API_key`` with your Mockaroo API key. Save the file and close it.

#### Trakt API Setup

To use Trakt API, you need to register for an account and create a Trakt App. 
1. Register for an account [here](https://login.apiary.io/register).
2. Create a new Trakt API app [here](https://trakt.tv/oauth/applications/new) to have 
your own ``client_id`` and ``client_secret``. <br>
For ``Name``, enter your project name (e.g. *TV Tracker*). <br>
For ``Description`` write a short description of the project (e.g. *A handy tool for tracking your shows across platforms.*). <br>
For ``Redirect uri``, enter `urn:ietf:wg:oauth:2.0:oob`. <br>
Leave the rest empty and click on ``SAVE APP``. <br>
You can now use ``client_id`` and ``client_secret`` for making Trakt API calls. More 
information about the Trakt API required headers is available [here](https://trakt.docs.apiary.io/#introduction/required-headers). 
3. To create an oauth token, follow [these instructions](https://github.com/xbgmsharp/trakt#usage). For Sprint 2, Oauth will not be needed. 
4. In your .env file, add the following line: 

> API_KEY_TRAKT=your_client_id

Replace ``your_client_id`` with your Trakt client ID. For example, if your client ID is 123456, the line would read:

> API_KEY_TRAKT=123456

#### TMDb API Setup

To use TMDb API to retrieve poster information for movies and shows, you need to register for an account. 
1. Register for an account [here](https://www.themoviedb.org/signup).
2. Click on your profile picture and press the 'Settings' button. Navigate to the API tab [here](https://www.themoviedb.org/settings/api).
3. Under the 'Request an API key' heading, press [click here](https://www.themoviedb.org/settings/api/request) and accept the terms. 
4. Create an application by filling out the details of your app. <br>
For ``Application URL``, if you do not yet have a URL, enter `not yet available`.
You can now use your API Key (v3 auth).
5. In your .env file, add the following line: 

> API_KEY_TMDB=your_api_key(v3 auth)

Replace ``your_api_key(v3 auth)`` with your TMDb API key. For example, if your API key is 123456, the line would read:

> API_KEY_TMDB=123456

#### MongoDB Setup

To use the TVTracker MongoDB database, you must follow these steps.
1. In the Org, navigate to ``Database Access`` under the ``Security`` tab.
2. Click ``ADD NEW DATABASE USER`` on the right of the screen and choose a username and password. Under Database User Privileges, select ``Atlas admin.`` Then, click ``Add User`` at the bottom.
3. Navigate to back-end. In your .env file, add the following lines:
> MONGODB_USERNAME=username

> MONGODB_PASSWORD=password

Replace ``username`` and ``password`` with the username and password you chose in step 2. For example, if your username is testUser and your password is testPass, the lines would read:

> MONGODB_USERNAME=testUser

> MONGODB_PASSWORD=testPass

#### JWT Token Setup

To use Json Web Token to generate unique tokens for secure access, please follow the step below: 
- Navigate to back-end. In your .env file, add the following line:
>TOKEN_SECRET=yourSecretCode

Replace ``yourSecretCode`` with the secret code you chose; secret code can be any word (alphanumeric characters). For example, if your secret code is TvTracker, the line would read: 

>TOKEN_SECRET=TvTracker

Then, in back-end, run:

> bash backEnd.sh