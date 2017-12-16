#!/bin/bash
npm install -g lerna@2 @alrra/travis-scripts asciify gnomon 
npm run createArchive
NPMRC=$?
if [ "${NMPRC}" != 0 ]; then
  echo "Build failed - Penguins to action"
  exit ${NPMRC};
fi
