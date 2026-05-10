/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/service-worker/noop.js"
/*!************************************!*\
  !*** ./src/service-worker/noop.js ***!
  \************************************/
() {

eval("{// No-op service worker - désactive le cache\n// Workbox InjectManifest injecte ici une liste vide (exclude: /.*/)\n[];\nself.addEventListener('install', function() {\n    return self.skipWaiting();\n});\nself.addEventListener('activate', function(event) {\n    event.waitUntil(caches.keys().then(function(keys) {\n        return Promise.all(keys.map(function(key) {\n            return caches.delete(key);\n        }));\n    }).then(function() {\n        return self.clients.claim();\n    }));\n});\nself.addEventListener('fetch', function(event) {\n    event.respondWith(fetch(event.request));\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWdlbi9lc20tYXBwLXNoZWxsLy4vc3JjL3NlcnZpY2Utd29ya2VyL25vb3AuanM/OTA3NyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBOby1vcCBzZXJ2aWNlIHdvcmtlciAtIGTDqXNhY3RpdmUgbGUgY2FjaGVcbi8vIFdvcmtib3ggSW5qZWN0TWFuaWZlc3QgaW5qZWN0ZSBpY2kgdW5lIGxpc3RlIHZpZGUgKGV4Y2x1ZGU6IC8uKi8pXG5zZWxmLl9fV0JfTUFOSUZFU1Q7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsICgpID0+IHNlbGYuc2tpcFdhaXRpbmcoKSk7XG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMua2V5cygpLnRoZW4oa2V5cyA9PlxuICAgICAgUHJvbWlzZS5hbGwoa2V5cy5tYXAoa2V5ID0+IGNhY2hlcy5kZWxldGUoa2V5KSkpXG4gICAgKS50aGVuKCgpID0+IHNlbGYuY2xpZW50cy5jbGFpbSgpKVxuICApO1xufSk7XG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2ZldGNoJywgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnJlc3BvbmRXaXRoKGZldGNoKGV2ZW50LnJlcXVlc3QpKTtcbn0pO1xuIl0sIm5hbWVzIjpbInNlbGYiLCJfX1dCX01BTklGRVNUIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNraXBXYWl0aW5nIiwiZXZlbnQiLCJ3YWl0VW50aWwiLCJjYWNoZXMiLCJrZXlzIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJrZXkiLCJkZWxldGUiLCJjbGllbnRzIiwiY2xhaW0iLCJyZXNwb25kV2l0aCIsImZldGNoIiwicmVxdWVzdCJdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBQzVDLG9FQUFvRTtBQUNwRUEsS0FBS0MsYUFBYTtBQUVsQkQsS0FBS0UsZ0JBQWdCLENBQUMsV0FBVztXQUFNRixLQUFLRyxXQUFXOztBQUN2REgsS0FBS0UsZ0JBQWdCLENBQUMsWUFBWSxTQUFDRTtJQUNqQ0EsTUFBTUMsU0FBUyxDQUNiQyxPQUFPQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0QsU0FBQUE7ZUFDakJFLFFBQVFDLEdBQUcsQ0FBQ0gsS0FBS0ksR0FBRyxDQUFDQyxTQUFBQTttQkFBT04sT0FBT08sTUFBTSxDQUFDRDs7T0FDMUNKLElBQUksQ0FBQztlQUFNUixLQUFLYyxPQUFPLENBQUNDLEtBQUs7O0FBRW5DO0FBQ0FmLEtBQUtFLGdCQUFnQixDQUFDLFNBQVMsU0FBQ0U7SUFDOUJBLE1BQU1ZLFdBQVcsQ0FBQ0MsTUFBTWIsTUFBTWMsT0FBTztBQUN2QyIsInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoiLi9zcmMvc2VydmljZS13b3JrZXIvbm9vcC5qcyJ9\n//# sourceURL=webpack-internal:///./src/service-worker/noop.js\n\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/service-worker/noop.js"]();
/******/ 	
/******/ })()
;