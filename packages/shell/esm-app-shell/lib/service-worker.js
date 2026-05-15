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

/***/ "./src/service-worker/noop.ts"
/*!************************************!*\
  !*** ./src/service-worker/noop.ts ***!
  \************************************/
() {

eval("{self.__WB_DISABLE_DEV_LOGS = true;\nvar wbManifest = [];\nself.addEventListener('message', function() {});\nself.addEventListener('install', function() {\n    // Skip over the \"waiting\" lifecycle state, to ensure that our\n    // new service worker is activated immediately, even if there's\n    // another tab open controlled by our older service worker code.\n    self.skipWaiting();\n});\nself.addEventListener('activate', function() {\n    // Optional: Get a list of all the current open windows/tabs under\n    // our service worker's control, and force them to reload.\n    // This can \"unbreak\" any open windows/tabs as soon as the new\n    // service worker activates, rather than users having to manually reload.\n    self.clients.matchAll({\n        type: 'window'\n    }).then(function(windowClients) {\n        windowClients.forEach(function(windowClient) {\n            windowClient.navigate(windowClient.url);\n        });\n    });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWdlbi9lc20tYXBwLXNoZWxsLy4vc3JjL3NlcnZpY2Utd29ya2VyL25vb3AudHM/ZTBiNSJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLl9fV0JfRElTQUJMRV9ERVZfTE9HUyA9IHRydWU7XG5jb25zdCB3Yk1hbmlmZXN0ID0gc2VsZi5fX1dCX01BTklGRVNUO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoKSA9PiB7fSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsICgpID0+IHtcbiAgLy8gU2tpcCBvdmVyIHRoZSBcIndhaXRpbmdcIiBsaWZlY3ljbGUgc3RhdGUsIHRvIGVuc3VyZSB0aGF0IG91clxuICAvLyBuZXcgc2VydmljZSB3b3JrZXIgaXMgYWN0aXZhdGVkIGltbWVkaWF0ZWx5LCBldmVuIGlmIHRoZXJlJ3NcbiAgLy8gYW5vdGhlciB0YWIgb3BlbiBjb250cm9sbGVkIGJ5IG91ciBvbGRlciBzZXJ2aWNlIHdvcmtlciBjb2RlLlxuICBzZWxmLnNraXBXYWl0aW5nKCk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgLy8gT3B0aW9uYWw6IEdldCBhIGxpc3Qgb2YgYWxsIHRoZSBjdXJyZW50IG9wZW4gd2luZG93cy90YWJzIHVuZGVyXG4gIC8vIG91ciBzZXJ2aWNlIHdvcmtlcidzIGNvbnRyb2wsIGFuZCBmb3JjZSB0aGVtIHRvIHJlbG9hZC5cbiAgLy8gVGhpcyBjYW4gXCJ1bmJyZWFrXCIgYW55IG9wZW4gd2luZG93cy90YWJzIGFzIHNvb24gYXMgdGhlIG5ld1xuICAvLyBzZXJ2aWNlIHdvcmtlciBhY3RpdmF0ZXMsIHJhdGhlciB0aGFuIHVzZXJzIGhhdmluZyB0byBtYW51YWxseSByZWxvYWQuXG4gIHNlbGYuY2xpZW50c1xuICAgIC5tYXRjaEFsbCh7XG4gICAgICB0eXBlOiAnd2luZG93JyxcbiAgICB9KVxuICAgIC50aGVuKCh3aW5kb3dDbGllbnRzKSA9PiB7XG4gICAgICB3aW5kb3dDbGllbnRzLmZvckVhY2goKHdpbmRvd0NsaWVudCkgPT4ge1xuICAgICAgICB3aW5kb3dDbGllbnQubmF2aWdhdGUod2luZG93Q2xpZW50LnVybCk7XG4gICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbInNlbGYiLCJfX1dCX0RJU0FCTEVfREVWX0xPR1MiLCJ3Yk1hbmlmZXN0IiwiX19XQl9NQU5JRkVTVCIsImFkZEV2ZW50TGlzdGVuZXIiLCJza2lwV2FpdGluZyIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJ0aGVuIiwid2luZG93Q2xpZW50cyIsImZvckVhY2giLCJ3aW5kb3dDbGllbnQiLCJuYXZpZ2F0ZSIsInVybCJdLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLHFCQUFxQixHQUFHO0FBQzdCLElBQU1DLGFBQWFGLEtBQUtHLGFBQWE7QUFFckNILEtBQUtJLGdCQUFnQixDQUFDLFdBQVcsWUFBTztBQUV4Q0osS0FBS0ksZ0JBQWdCLENBQUMsV0FBVztJQUMvQiw4REFBOEQ7SUFDOUQsK0RBQStEO0lBQy9ELGdFQUFnRTtJQUNoRUosS0FBS0ssV0FBVztBQUNsQjtBQUVBTCxLQUFLSSxnQkFBZ0IsQ0FBQyxZQUFZO0lBQ2hDLGtFQUFrRTtJQUNsRSwwREFBMEQ7SUFDMUQsOERBQThEO0lBQzlELHlFQUF5RTtJQUN6RUosS0FBS00sT0FBTyxDQUNUQyxRQUFRLENBQUM7UUFDUkMsTUFBTTtJQUNSLEdBQ0NDLElBQUksQ0FBQyxTQUFDQztRQUNMQSxjQUFjQyxPQUFPLENBQUMsU0FBQ0M7WUFDckJBLGFBQWFDLFFBQVEsQ0FBQ0QsYUFBYUUsR0FBRztRQUN4QztJQUNGO0FBQ0oiLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6Ii4vc3JjL3NlcnZpY2Utd29ya2VyL25vb3AudHMifQ==\n//# sourceURL=webpack-internal:///./src/service-worker/noop.ts\n\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/service-worker/noop.ts"]();
/******/ 	
/******/ })()
;