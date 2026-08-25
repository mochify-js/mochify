# Changes

## 2.0.0

- [`34454c6`](https://github.com/mochify-js/mochify/commit/34454c60f11a034860628d740dc9a940d2856c42)
  chore: upgrade mocha from 11 to 12 (rc6) (Yashar Fakhari)
    >
    > BREAKING CHANGE: upgrade mocha to 12 (rc6)
    >
- [`aeb3e8d`](https://github.com/mochify-js/mochify/commit/aeb3e8d40a13be4dcc6fa1b3c5275356cbbdd619)
  chore(deps-dev): upgrade eslint to 10.9.0, @studio/eslint-config to 9.0.1 (Yashar Fakhari)
    >
    > @studio/eslint-config 9 pulls in eslint-plugin-jsdoc 62, which enables
    > jsdoc/reject-any-type and jsdoc/reject-function-type. Both fired on the
    > client value mappers, so the `any` and `Function` JSDoc types in
    > lib/map-client-value.js and lib/poll-events.js are replaced with types
    > describing the client wire format. mapClientValue now takes and returns
    > `unknown`, so its tests state the type each case expects.
    >
    > BREAKING CHANGE: require NodeJS 22.13+
    >
- [`71135a8`](https://github.com/mochify-js/mochify/commit/71135a838939576f257858b7e8341825042bf42e)
  chore(deps-dev): upgrade typescript to 7.0.2, drop @studio/tsconfig (Yashar Fakhari)
    >
    > @studio/tsconfig capped typescript at ^5, blocking the upgrade. Its
    > settings are now inlined in tsconfig.json (Node 22+, nodenext), with
    > tsconfig.pack.json and test/tsconfig.types-check.json extending it
    > locally. Updates JSDoc function types and two `let x = null` sites for
    > TS7's stricter checker, and installs @types/mocha, which was never
    > actually present despite being referenced in "types".
    >
    > BREAKING CHANGE: require Node.js >=22
    >
- [`79eba20`](https://github.com/mochify-js/mochify/commit/79eba2091c12fa8237f5a9de3a1d2eb1b3687a2b)
  fix: correct expected stack line in failure integration test (Yashar Fakhari)
- [`a21b008`](https://github.com/mochify-js/mochify/commit/a21b0087da0e02dcb607de200b1a12aa81b2c6ec)
  chore: update actions/setup-node (Yashar Fakhari)
- [`b1f9d7f`](https://github.com/mochify-js/mochify/commit/b1f9d7f61bd902e4b8044dce52c7214242cd875a)
  chore(deps-dev): bump @types/node from 26.1.2 to 26.2.0 (#92) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`b956c53`](https://github.com/mochify-js/mochify/commit/b956c53b0456c61b36632d821682b6f016974149)
  chore(deps-dev): bump lint-staged from 17.2.0 to 17.3.0 (#94) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`4781dc5`](https://github.com/mochify-js/mochify/commit/4781dc5bc75d459219ede5e7d49718eda171742a)
  ci: remove automerge flag for dependabot merge task (Yashar Fakhari)
- [`0235f35`](https://github.com/mochify-js/mochify/commit/0235f35903c94966e34a16a6dcf97d2b78e633a3)
  chore(deps): bump actions/setup-node from 6 to 7 (#91) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a6cf1db`](https://github.com/mochify-js/mochify/commit/a6cf1dbbd1e91cdfcb91b501825af7d2181a8610)
  chore(deps): bump execa from 9.6.1 to 10.0.1 (#83) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`04aa0a4`](https://github.com/mochify-js/mochify/commit/04aa0a46a33eff9926dffe0d08b1c8aecfa595e8)
  chore(deps-dev): bump jsdom from 29.1.1 to 30.0.1 (#90) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`20c9b45`](https://github.com/mochify-js/mochify/commit/20c9b4591c7df96e18fdbeffa681912188a158bd)
  ci: drop Nodejs 20 from Github workflow (Yashar Fakhari)
- [`d7e018f`](https://github.com/mochify-js/mochify/commit/d7e018f968d39f9a395218f2978970497e702b44)
  chore(deps-dev): bump c8 from 11.0.0 to 12.0.0 (#88) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a27aa52`](https://github.com/mochify-js/mochify/commit/a27aa52d343b4d26fc311290cd77dcd9e5b42a6d)
  chore(deps): bump mocha from 11.7.5 to 11.8.0 (#74) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`d13e321`](https://github.com/mochify-js/mochify/commit/d13e32154e8cc27bdfb4b0dbbc435ee6c4aee440)
  chore(deps-dev): bump prettier from 3.9.4 to 3.9.6 (#85) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a5a540f`](https://github.com/mochify-js/mochify/commit/a5a540fb07894458a8edf8c9885b746f95b6ac52)
  chore(deps): bump source-map from 0.7.6 to 0.8.0 (#87) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`f3408ac`](https://github.com/mochify-js/mochify/commit/f3408acb360b4c893cb2d04891a0e98a0c1260f8)
  chore(deps-dev): bump lint-staged from 17.0.8 to 17.2.0 (#89) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`d61e0bd`](https://github.com/mochify-js/mochify/commit/d61e0bd453f974dd090617f5544e059835437a06)
  chore(deps-dev): bump @types/node from 26.0.1 to 26.1.2 (#82) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`1692a3d`](https://github.com/mochify-js/mochify/commit/1692a3d8acf238fd73dd06e8765a6cedb7225011)
  chore(deps): bump actions/checkout from 6 to 7 (#81) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`ddd706c`](https://github.com/mochify-js/mochify/commit/ddd706c42bab598279e470148af43d00ff42bb2a)
  chore(deps-dev): bump prettier from 3.8.3 to 3.9.4 (#78) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`3946ace`](https://github.com/mochify-js/mochify/commit/3946ace54f66ab020a406ae70fb9c04ed95a79f9)
  chore(deps-dev): bump @types/node from 25.6.0 to 26.0.1 (#79) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`51a0ba0`](https://github.com/mochify-js/mochify/commit/51a0ba0391d810dd8dcaed17bfd73c4fd3b7f3f2)
  chore(deps-dev): bump lint-staged from 17.0.7 to 17.0.8 (#77) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a924db7`](https://github.com/mochify-js/mochify/commit/a924db71fdfd275c65298ea1416a4967719dd00c)
  chore(deps-dev): bump lint-staged from 16.4.0 to 17.0.7 (#73) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e64071c`](https://github.com/mochify-js/mochify/commit/e64071c83240893afbf4c9b178563902d75660f6)
  chore(deps-dev): bump prettier from 3.8.1 to 3.8.3 (#72) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a378147`](https://github.com/mochify-js/mochify/commit/a378147460f4146b0fc4d44f2f5fc3b168381882)
  chore(deps-dev): bump jsdom from 29.0.1 to 29.1.1 (#69) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`16b059c`](https://github.com/mochify-js/mochify/commit/16b059c5a1b14f3a7cfa4056ece8d9f010aaeca6)
  chore(deps-dev): bump @types/node from 25.5.0 to 25.6.0 (#68) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`de878ad`](https://github.com/mochify-js/mochify/commit/de878ad9818c187546f5f04b580c670ecd642e95)
  chore(deps-dev): bump lint-staged from 16.3.0 to 16.4.0 (#66) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`d90b422`](https://github.com/mochify-js/mochify/commit/d90b422507f01ede8efb56e984a8408872e0a0f2)
  chore(deps-dev): bump jsdom from 28.1.0 to 29.0.1 (#65) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`50d758c`](https://github.com/mochify-js/mochify/commit/50d758c1fd7de908ebdf5b1c8d347bd6980fed2c)
  chore(deps-dev): bump @types/node from 25.3.3 to 25.5.0 (#63) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`d6c003c`](https://github.com/mochify-js/mochify/commit/d6c003c4fd8fefe36cd6f9d20791d4c3b2aa4cb9)
  chore(deps-dev): bump @sinonjs/referee-sinon from 12.0.0 to 12.0.1 (#61) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`d7e7cd0`](https://github.com/mochify-js/mochify/commit/d7e7cd017464c22f7baea8fea858a0c84d4cfc4e)
  chore(deps-dev): bump lint-staged from 16.2.7 to 16.3.0 (#59) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`47cba9a`](https://github.com/mochify-js/mochify/commit/47cba9a9adc3df4aa6456a7f514bbb8383f2eb90)
  chore(deps-dev): bump prettier from 3.7.4 to 3.8.1 (#53) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e807f66`](https://github.com/mochify-js/mochify/commit/e807f66e6db5648f178256f6b7833f8c25521508)
  chore(deps-dev): bump c8 from 10.1.3 to 11.0.0 (#57) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`7bd66f7`](https://github.com/mochify-js/mochify/commit/7bd66f7926d9f5e4d0f23392b1bf6372259685da)
  chore(deps-dev): bump @types/node from 25.1.0 to 25.3.3 (#60) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`7ecfce1`](https://github.com/mochify-js/mochify/commit/7ecfce1c8ca1fe0568b62b4551cc8087540f4f8f)
  chore(deps-dev): bump rimraf from 6.1.2 to 6.1.3 (#58) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`52b83c9`](https://github.com/mochify-js/mochify/commit/52b83c9644d550b304e7ac5378819f77404c385b)
  chore(deps-dev): bump jsdom from 27.4.0 to 28.1.0 (#55) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e0ecdec`](https://github.com/mochify-js/mochify/commit/e0ecdecc1331ee0ffde09e115c67d41f0e1a022f)
  chore(deps-dev): bump @types/node from 25.0.3 to 25.1.0 (#52) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`c9ff40b`](https://github.com/mochify-js/mochify/commit/c9ff40b8b7e0edd3071f6e737a1f87b676165712)
  chore(deps): bump actions/checkout from 5 to 6 (#50) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a99b856`](https://github.com/mochify-js/mochify/commit/a99b856d60ce622b0eff0128dc74599541815877)
  chore(deps): bump actions/setup-node from 5 to 6 (#51) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a8d8109`](https://github.com/mochify-js/mochify/commit/a8d8109701ca9c68978289f077d1ef1412ef02b3)
  chore(deps-dev): bump @types/node from 24.10.1 to 25.0.3 (#48) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e9f6a4a`](https://github.com/mochify-js/mochify/commit/e9f6a4aca659cba322452e0f52c53ef7306e7e62)
  chore(deps-dev): bump prettier from 3.7.3 to 3.7.4 (#49) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a51d8e7`](https://github.com/mochify-js/mochify/commit/a51d8e7d67118bf5e916874b40112e2187e7343e)
  chore(deps-dev): bump eslint from 9.39.1 to 9.39.2 (#47) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`1c9152e`](https://github.com/mochify-js/mochify/commit/1c9152edb02eea32aacad0e8f81647c5a90d558d)
  chore(deps-dev): bump jsdom from 27.2.0 to 27.4.0 (#46) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`3d0cd63`](https://github.com/mochify-js/mochify/commit/3d0cd63039624a415b37a5ad5394cfaebe29495c)
  chore(deps-dev): bump prettier from 3.6.2 to 3.7.3 (#42) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`46497be`](https://github.com/mochify-js/mochify/commit/46497bef9fd686c295364a94acb13f2678b26ea9)
  chore(deps-dev): bump rimraf from 6.1.0 to 6.1.2 (#44) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`96611bb`](https://github.com/mochify-js/mochify/commit/96611bb484675cd7e733cbf13041b0c51283c9b9)
  chore(deps): bump execa from 9.6.0 to 9.6.1 (#45) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`dca085e`](https://github.com/mochify-js/mochify/commit/dca085eccf6c073108082dbf35097b7186c3d7a3)
  chore(deps-dev): bump @types/node from 24.9.2 to 24.10.1 (#38) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`b66c3b9`](https://github.com/mochify-js/mochify/commit/b66c3b95117abf56941497bc5e30b676dbcdfc79)
  chore(deps-dev): bump lint-staged from 16.2.6 to 16.2.7 (#40) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`036130d`](https://github.com/mochify-js/mochify/commit/036130d56fc279b07d636b5939231e17ca517b03)
  chore(deps): bump mocha from 11.7.3 to 11.7.5 (#43) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`b8ffb98`](https://github.com/mochify-js/mochify/commit/b8ffb98b96ab4bb5aad530c9f49f9a9702e640a9)
  chore(deps-dev): bump jsdom from 27.1.0 to 27.2.0 (#41) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`f92a5de`](https://github.com/mochify-js/mochify/commit/f92a5de384803f0f210dcb9555e337643b819432)
  chore(deps-dev): bump eslint from 9.39.0 to 9.39.1 (#39) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`942a632`](https://github.com/mochify-js/mochify/commit/942a632638b5939b05a994061a716bd0ec10d668)
  chore(deps): bump glob from 11.0.3 to 13.0.0 (#37) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`0e9b7ef`](https://github.com/mochify-js/mochify/commit/0e9b7ef52000cc3b64e84cdceb432923329dc635)
  chore(deps-dev): bump lint-staged from 16.2.3 to 16.2.6 (#35) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`fea210d`](https://github.com/mochify-js/mochify/commit/fea210dc5d2b7f282f2199b5dde3d0167dba7a82)
  chore(deps-dev): bump rimraf from 6.0.1 to 6.1.0 (#36) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`3c1daa8`](https://github.com/mochify-js/mochify/commit/3c1daa8b62366b1fc83a7c5d0621de2e66246f45)
  chore(deps-dev): bump eslint from 9.36.0 to 9.39.0 (#33) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`a91deff`](https://github.com/mochify-js/mochify/commit/a91deffae3ab4e55c6c0e258233869542f4c13ef)
  chore(deps-dev): bump @types/node from 24.6.1 to 24.9.2 (#32) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e2bf84a`](https://github.com/mochify-js/mochify/commit/e2bf84a4d94e41465639132a1949cd182b6623f0)
  chore(deps-dev): bump jsdom from 27.0.0 to 27.1.0 (#31) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`17752b4`](https://github.com/mochify-js/mochify/commit/17752b434ef78bdc1614496b5ab27f8d56788dfa)
  chore(deps): bump actions/setup-node from 4 to 5 (#30) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`67f18e0`](https://github.com/mochify-js/mochify/commit/67f18e06e5836a866f40032abdf1cfac6e20b30b)
  chore(deps): bump mime from 4.0.7 to 4.1.0 (#26) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`02cce4a`](https://github.com/mochify-js/mochify/commit/02cce4ada3c3c239a733ec07737400c14b97fedd)
  chore(deps-dev): bump jsdom from 26.1.0 to 27.0.0 (#27) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`71beb8f`](https://github.com/mochify-js/mochify/commit/71beb8f7d9c6680374538b315fdc544311c7e0bd)
  chore(deps-dev): bump @types/node from 24.3.0 to 24.6.1 (#29) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e18d616`](https://github.com/mochify-js/mochify/commit/e18d616e6c13496483f44997111b2f1787fcea51)
  chore(deps-dev): bump typescript from 5.9.2 to 5.9.3 (#28) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`e563842`](https://github.com/mochify-js/mochify/commit/e5638429bc6a6a638ee8b05678b3689e20708eb5)
  chore(deps-dev): bump eslint from 9.34.0 to 9.36.0 (#25) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`0582756`](https://github.com/mochify-js/mochify/commit/058275612d1405824fe281bc20a912b27ae65f37)
  chore(deps-dev): bump lint-staged from 16.1.5 to 16.2.3 (#24) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`ad0830d`](https://github.com/mochify-js/mochify/commit/ad0830d8c9536b119137d893204ee0ac299c49ec)
  chore(deps): bump mocha from 11.7.1 to 11.7.3 (#23) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`5f071eb`](https://github.com/mochify-js/mochify/commit/5f071eb3bd1d1bfd4404c3ec08f0acae6e7a41ed)
  chore(deps-dev): bump eslint from 9.33.0 to 9.34.0 (#22) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>

_Released by Yashar Fakhari on 2026-08-25._

## 1.0.1

- [`67bf39c`](https://github.com/mochify-js/mochify/commit/67bf39c3982e55e6a9f3bc4f8112ee7e297c9c92)
  chore: update dependencies (Yashar Fakhari)
- [`5ad0d9d`](https://github.com/mochify-js/mochify/commit/5ad0d9d63b69dc74c8a887f766fe63cf02abcf3e)
  build: clean before build when running prepack (Yashar Fakhari)
- [`86f3049`](https://github.com/mochify-js/mochify/commit/86f3049564089c6763107c271a9f19aa201a24e1)
  fix: don't leak mocha types, add tests for type leak (Yashar Fakhari)

_Released by Yashar Fakhari on 2025-08-15._

## 1.0.0

- [`3ad28a7`](https://github.com/mochify-js/mochify/commit/3ad28a76fb3d7d9147bbd4ebdf6f0899059bf7c2)
  chore: dependabot to update package.json (Yashar Fakhari)
- [`d9bb462`](https://github.com/mochify-js/mochify/commit/d9bb4629037cd97bf364b8e9189f8e2c21262106)
  chore(deps-dev): bump eslint from 9.32.0 to 9.33.0 (#16) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`6e93813`](https://github.com/mochify-js/mochify/commit/6e9381366fe04cebca78aaf5c203a48a184d2743)
  chore(deps-dev): bump lint-staged from 16.1.4 to 16.1.5 (#17) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`8798f30`](https://github.com/mochify-js/mochify/commit/8798f3080f20fc31172d45792dabb0ec53006e2d)
  chore(deps-dev): bump @types/node from 24.2.0 to 24.2.1 (#15) (dependabot[bot])
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`eff996a`](https://github.com/mochify-js/mochify/commit/eff996acd5874edeaa5ecbb0f50bddf82ceb849f)
  chore: Add Dependabot config and automerge (Yashar Fakhari)
- [`729d13f`](https://github.com/mochify-js/mochify/commit/729d13fbf285da0d2b9808779c1ce06e1ca75e36)
  test: add coverage reporting and update CI workflow (Yashar Fakhari)
    >
    > - add c8 for coverage reporting and enforce coverage at current baseline to reduce chances of regression
    > - update CI to run coverage checks on node 20 and skip duplicate test runs
- [`d1bb398`](https://github.com/mochify-js/mochify/commit/d1bb39805df9cb25dacd68fca6fb0f73439cb6bc)
  chore(doc): Update documentation (Yashar Fakhari)
- [`387e5ce`](https://github.com/mochify-js/mochify/commit/387e5cec697ec0c3e0743f7dd0dea715a172c757)
  chore: Upgrade dependencies (#11) (Yashar Fakhari)
    >
    > - Upgrade execa to v9.6.0
    >   - Remove deprecated `result.killed` check as execa now throws on failure
    >   - Update test expectations from Error to ExecaError type
    > - Upgrade mime to v4.0.7 with ESM compatibility
    >   - Implement async dynamic import for ESM-only mime package
    >   - Add race condition-safe module loading with promise caching
    > - Upgrade ESLint to v9.32.0
    >   - Add eslint.config.js as the flat config
    >   - Upgrade @studio/eslint-config to v8.0.1 for the studio eslint configs
    > - Remove unused error parameter in catch block to fix linting
    > - Add JSDoc comment for requestHandler
    >   - Add null checks for req.url to satisfy TypeScript strict mode
    > - Update GitHub workflow
    >   - Add read-only permissions
    >   - Update to Node.js 20/22 matrix
    >   - Include build step in CI checks
    > - Upgrade husky to v9
    >   - Remove deprecated script code from husky pre-commit script
    > - Upgrade other dependencies
    >  

_Released by Yashar Fakhari on 2025-08-15._

## 0.5.9

- 🍏 [`95b27fa`](https://github.com/mochify-js/mochify/commit/95b27fa088070dbedc9f5b92fa854ccc69e88f0f)
  Add support for "require" config
- ✨ [`dbab7f2`](https://github.com/mochify-js/mochify/commit/dbab7f2ac845aff4e83ea572379127061d132849)
  Run installed version of tsc in GH action

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-11-05._

## 0.5.8

- 🍏 [`a273579`](https://github.com/mochify-js/mochify/commit/a27357991f241e82706a5a6ad3d5f733d0c3e2db)
  Install custom inspect on DOM objects
- 🍏 [`e7567e4`](https://github.com/mochify-js/mochify/commit/e7567e46432f6737f79eeeb94ad326696f2dc7de)
  Rewrite data serialization protocol
- ✨ [`8ebf1e5`](https://github.com/mochify-js/mochify/commit/8ebf1e57baf1c2c4fd73f947e1442a21c289e41a)
  Remove node 16, add node 22
- ✨ [`481b6b5`](https://github.com/mochify-js/mochify/commit/481b6b5e270002c31069afa9d2f4a293f11e24c7)
  Update mocha
- ✨ [`2874b57`](https://github.com/mochify-js/mochify/commit/2874b57b32d4b22906f2c187847db598dddc2484)
  Modernize client.js

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-17._

## 0.5.7

- 🐛 [`58c0f28`](https://github.com/mochify-js/mochify/commit/58c0f28bf68db4a056073e250ad574f1576a2138)
  Serialize and deserialize functions and special values

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-14._

## 0.5.6

- 🐛 [`7e79b8d`](https://github.com/mochify-js/mochify/commit/7e79b8d8c7098ce3a8ccf687593f775539e7bf4a)
  Remove circular references and deep copy

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-12._

## 0.5.5

- 🐛 [`46d4b4b`](https://github.com/mochify-js/mochify/commit/46d4b4b13578160829cc4a0f3d809037fb80c2b9)
  Remove circular dependencies from objects sent over the wire
- 🐛 [`a33f7a7`](https://github.com/mochify-js/mochify/commit/a33f7a79b113219237d4bf9b5161fb66f83c243a)
  Do not use the failure count as exit code
- ✨ [`ed2b110`](https://github.com/mochify-js/mochify/commit/ed2b1105b6644268a0828b05b23cb063c8328b81)
  Add onunhandledrejection handler
- ✨ [`9cb6c5a`](https://github.com/mochify-js/mochify/commit/9cb6c5a34dffd4860af559b215b0eab696eda470)
  Call `write` directly in global error handler

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-05-27._

## 0.5.4

- [`64667d9`](https://github.com/mochify-js/mochify/commit/64667d92689f608169d63c1a5a26063844af7c8e)
  Fix stack-mapper internal frame filtering

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-01-03._

## 0.5.3

- [`0590c3f`](https://github.com/mochify-js/mochify/commit/0590c3f27f5a8d0d044b94559882738286d02800)
  Forward bundle command stderr

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-01-03._

## 0.5.2

- [`2940d8c`](https://github.com/mochify-js/mochify/commit/2940d8c05fc0973bf4d8b459321ce5c00a750cee)
  Remove test framework internal frames from stack traces

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-29._

## 0.5.1

- [`f42f066`](https://github.com/mochify-js/mochify/commit/f42f0665684908abdc73977c1e0a69fb80b0956c)
  Improve stack trace mapping

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-28._

## 0.5.0

- [`9a656eb`](https://github.com/mochify-js/mochify/commit/9a656ebc1aa741932177cd7288edb4b6382a90df)
  Add bundle_stdin option
- [`d547799`](https://github.com/mochify-js/mochify/commit/d5477997eaa62e7bc55d0b2e391b00a58b209075)
  Sort resolved specs to align with mocha behavior
- [`4902bb6`](https://github.com/mochify-js/mochify/commit/4902bb60b0f78fe056b689fca090957ced213ff9)
  Add missing types to resolve-bundle
- [`994a054`](https://github.com/mochify-js/mochify/commit/994a05499cd57fc81f6068b81b83f644c645cf6d)
  Upgrade glob

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-27._

## 0.4.0

- Initial release

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-12-24._
