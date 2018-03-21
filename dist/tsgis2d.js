(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ol"), require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["ol", "jQuery"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("ol"), require("jQuery")) : factory(root["ol"], root["jQuery"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "cd792aa0552670680f51"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 2;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(10)(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;﻿/**
 *  @author by ligang on 2014/8/13.
 *  modify }{yellow
 */

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

    var id = 10000;
    /**
     * @class
     * @classdesc
     * 定义类型工具，实现类型继承
     * @alias g2.lang.classUtil
     * @returns {g2.lang.classUtil} 返回类型工具
     */
    var util = function () {
    }

    /*  util.extend = function (child, parent) {
     var F = function () {
     };
     F.prototype = parent.prototype;
     child.prototype = new F();
     child.prototype.constructor = child;
     child.uber = parent.prototype;
     }*/

    function inherts(child, parent) {
        var p = parent.prototype;
        var c = child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
        inherts2(child);
    }

    function inherts2(type) {
        type.extend = function (child) {
            var that = this;
            var F = typeof child.initialize == 'function' ? child.initialize : function (opts) {
                that.call(this, opts || {});
            };
            inherts(F, this);
            for (var i in child) {
                if (child.hasOwnProperty(i) && i !== 'prototype') {
                    if (i != 'initialize') {
                        F.prototype[i] = child[i];
                    }
                }
            }
            return F;
        }
    }

    util.extend2 = function (child, parent) {
        inherts(child, parent);
        /*
         var p = parent.prototype;
         var c = child.prototype;
         for (var i in p) {
         c[i] = p[i];
         }
         c.uber = p;
         */
    }

    util.extend = function (parent, child) {
        var F = typeof child.initialize == 'function' ? child.initialize : function (opts) {
            var options = opts || {};
            parent.call(this, options);
        };

        util.extend2(F, parent);
        for (var i in child) {
            if (child.hasOwnProperty(i) && i !== 'prototype') {
                if (i != "initialize") {
                    F.prototype[i] = child[i];
                }
            }
        }
        return F;
    };

    util.isArray = function (obj) {
        return (!!obj && obj.constructor == Array);
    }

    util.newId = function () {
        return id++;
    }

    util.extendCopy = function (p) {
        var c = {};
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
        return c;
    }

    util.deepCopy = deepCopy;

    util.objectPlus = function (o, stuff) {
        var n;

        function F() {
        };
        F.prototype = o;
        n = new F();
        n.uber = o;

        for (var i in stuff) {
            n[i] = stuff[i];
        }

        return n;
    }

    util.extendMulti = function () {
        var n = {}, stuff, j = 0, len = arguments.length;
        for (j = 0; j < len; j++) {
            stuff = arguments[j];
            for (var i in stuff) {
                n[i] = stuff[i];
            }
        }
        return n;
    }

    function deepCopy(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            }
            else {
                c[i] = p[i];
            }
        }
        return c;
    }

    return util;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;
!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

    /***
     * 定义地图要处理的事件列表
     * @returns 返回事件列表
     */
    function createEvents() {
        var events = {};
        events.click = [];
        events.mousemove = [];
        //events.mouseout = [];
        events.mousedown = [];
        events.mouseup = [];
        events.dblclick = [];
        events.extentchanged = [];
        events.resize = [];
        events.resolutionchanged = [];
        events.precompose = [];
        events.postrender = [];
        events.postcompose = [];
        //events.tick = [];
        events.prerender = [];
        events.wheel = [];
        events.position3d=[];
        return events;
    }
    /**
     * @class
     * @classdesc
     * 地图类型接口
     * @alias g2.maps.IMap
     * @returns {g2.maps.IMap} 地图类型接口
     */
    var map = function () {
        //定义地图图层列表
        this.layers = [];
        //定义地图工具对象
        this.tool = null;
        //定义地图鼠标的图标
        this.cursor = null;
        //定义地图事件列表
        this.events = createEvents();
    }

    /**
     * 定义带参数的地图初始化
     * @param {Anonymous} opts 包含初始化参数的复杂对象
     */
    map.prototype.init = function (opts) {
    }

    /**
     * 定义添加图层方法
     * @param {g2.lys.ILayer} layer 添加的图层
     */
    map.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    }
    /**
     * 获取可视范转
     */
    map.prototype.getExtent = function () {
    }
    /**
     * 删除图层
     * @param {g2.lys.ILayer} layer 要删除的图层
     */
    map.prototype.removeLayer = function (layer) {
        var index = this.layers.indexOf(layer);
        if (index >= 0) {
            this.layers.splice(index, 1);
        }
    }
    /**
     * 设置鼠标样式
     * @param {Object} cursor 鼠标样式
     */
    map.prototype.setCursor = function (cursor) {

    }
    /**
     * 返回地图窗口尺寸 px单位
     * @return {Array} 返回地图窗口的尺寸，如[782, 389]
     */
    map.prototype.getViewSize = function () {
    };

    /**
     * 设置地图窗口尺寸大小 px单位
     * @param width  地图宽度
     * @param height 地图高度
     */
    map.prototype.setViewSize=function(width,height){

    };
    /**
     * 获取图层数量
     * @returns {Number} 返回图层数量
     */
    map.prototype.getLayerCount = function () {
        return this.layers.length;
    }

    /**
     * 获取指定索引位置的图层
     * @param {Number} index 索引
     * @returns {g2.lys.ILayer} 返回图层
     */
    map.prototype.getLayer = function (index) {
        return this.layers[index];
    }

    /**
     * 获取所有图层
     * @returns {g2.lys.ILayer} 返回图层数组
     */
    map.prototype.getLayers = function () {
        return this.layers;
    }

    /**
     * 获取地图缩放级别
     */
    map.prototype.getZoomLevel = function () {
    }

    /**
     * 获取分辨率
     */
    map.prototype.getResolution = function () {
    }

    /**
     * 设置分辨率
     */
    map.prototype.setResolution = function () {
    }

    /**
     * 获取坐标原点
     */
    map.prototype.getOrigin = function () {

    }

    /**
     * 查找图层
     * @param {String} name 图层名称
     * @returns {g2.lys.ILayer} 返回图层
     */
    map.prototype.findLayer = function (name) {
        for (var i = 0; i < this.layers.length; ++i) {
            var layer = this.layers[i];
            if (layer.name == name || layer.id == name) {
                return layer;
            }
        }
        return null;
    }

    /**
     * 监听指定名称的鼠标事件并设置关联的事件处理方法
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    map.prototype.on = function (name, func) {
        if (name in this.events) {
            var events = this.events[name];
            events.push(func);
        }
    }

    /**
     * 取消监听指定名称的鼠标事件并取消事件处理方法的关联
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    map.prototype.un = function (name, func) {
        if (name in  this.events) {
            var events = this.events[name];
            for (var i = 0, len = events.length; i < len; ++i) {
                var event = events[i];
                if (event === func) {
                    events.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    /**
     * 地图缩放到空间数据定义的全图范围
     */
    map.prototype.fullExtent = function () {
    }

    /**
     * 地图缩小
     */
    map.prototype.zoomOut = function () {
    }

    /**
     * 地图放大
     */
    map.prototype.zoomIn = function () {
    }

    /**
     * 缩放到指定级别
     */
    map.prototype.zoomTo = function (level) {

    }

    /**
     * 平移几何图形对象
     * @param {g2.geom.Geometry} geometry 几何图形
     */
    map.prototype.pan = function (geometry) {
    }

    /**
     * 地图旋转by陈林
     */
    map.prototype.rotate = function (){

    }

    /**
     * 设定指定的坐标点为地图中心点
     * @param {Point} center 地理坐标点
     */
    map.prototype.setCenter = function (center) {
    }

    /**
     * 获取指定的地理坐标点显示在屏幕上的位置
     * @param {Array} coordinate 地理坐标点[x,y]
     */
    map.prototype.getPixelFromCoordinate = function (coordinate) {
    }

    /**
     * 获取屏幕上指定像素点对应的地理坐标点
     * @param {Array} pixel 屏幕像素点坐标[x,y]
     */
    map.prototype.getCoordinateFromPixel = function (pixel) {
    }

    /**
     * 导出
     * @param {String} name 导出名称
     */
    map.prototype.export = function (name) {
    }

    /**
     * 停止拖拽
     */
    map.prototype.stopDragPan = function () {
    }

    /**
     * 继续拖拽
     */
    map.prototype.resumeDragpan = function () {
    }

    /**
     * 停止双击
     */
    map.prototype.stopDbClick = function () {
    }

    /**
     * 继续双击
     */
    map.prototype.resumeDbClick = function () {
    }

    /**
     * 停止放大缩小
     */
    map.prototype.stopMouseWheelZoom = function () {
    }

    /**
     * 继续放大缩小
     */
    map.prototype.resumeMouseWheelZoom = function () {
    }

    /**
     * 添加地图相关控件
     * @param {Object} ctl 控件
     */
    map.prototype.addControl = function (ctl) {
    }
    /**
     * 当前正在使用的地图工具
     * @param {g2.cmd.ToolBase} tool 地图工具
     */
    map.prototype.currentTool = function (tool) {
        if (this.tool != tool) {
            if (this.tool != null) {
                this.tool.deactivate();
            }
            this.tool = tool;
            if (this.tool != null) {
                this.cursor = this.tool.cursor;
            }
        }
    }

    /**
     * 鼠标单击事件
     * @fires g2.maps.IMap#mouseclick
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseClick = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseClick(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.click.length; ++i) {
            var event = this.events.click[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标悬停事件
     * @fires IMap#mouseover
     * @param {Event} e 事件对象
     */
    map.prototype.onMouseOver = function (e) {
        if (this.tool != null) {
            this.tool.onMouseOver(e);
        }
    }

    /**
     * 鼠标按键按下时的事件处理方法
     * @fires IMap#mousedown
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseDown = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseDown(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mousedown.length; ++i) {
            var event = this.events.mousedown[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标按键按下后抬起的事件的处理方法
     * @fires g2.maps.IMap#mouseup
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseUp = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseUp(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mouseup.length; ++i) {
            var event = this.events.mouseup[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标移动事件处理方法
     * @fires g2.maps.IMap#mousemove
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    map.prototype.onMouseMove = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseMove(button, shift, screenX, screenY, mapX, mapY, handle);
        }

        for (var i = 0; i < this.events.mousemove.length; ++i) {
            var event = this.events.mousemove[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 地图可视范围改变事件
     * @fires g2.maps.IMap#extentchanged
     * @param {Number} left 左上角X坐标
     * @param {Number} top 左上角Y坐标
     * @param {Number} right 右下角X坐标
     * @param {Number} bottom 右下角Y坐标
     */
    map.prototype.onExtentChanged = function (left, top, right, bottom) {
        for (var i = 0; i < this.events.extentchanged.length; ++i) {
            var event = this.events.extentchanged[i];
            event(left, top, right, bottom);
        }
    }
    ///**
    // * 计时器
    // * @param time 当前的时间
    // */
    //map.prototype.onTick = function (time) {
    //    for (var i = 0; i < this.events.tick.length; ++i) {
    //        var event = this.events.tick[i];
    //        event(time);
    //    }
    //}//
    /**
     * 鼠标双击事件
     * @fires g2.maps.IMap#dblclick
     * @param {Number} pixelX 屏幕坐标x
     * @param {Number} pixelY 屏幕坐标y
     * @param {Number} coordinateX 地图坐标x
     * @param {Number} coordinateY 地图坐标y
     */
    map.prototype.onDblclick = function (pixelX, pixelY, coordinateX, coordinateY) {
        for (var i = 0; i < this.events.dblclick.length; ++i) {
            var event = this.events.dblclick[i];
            event(pixelX, pixelY, coordinateX, coordinateY);
        }
    }
    /***
     * 返回第三方的map对象，该对象不受平台维护
     */
    map.prototype.getMapControl = function () {
    }
    /**
     * 比例尺改变事件
     * @fires g2.maps.IMap#resolutionchanged
     * @param {Number} newResolution 新的分辨率
     * @param {Number} oldResolution 旧的分辨率值
     * @param {Number} level 当前层级
     */
    map.prototype.onResolutionChanged = function (newResolution, oldResolution, level) {
        for (var i = 0; i < this.events.resolutionchanged.length; ++i) {
            var event = this.events.resolutionchanged[i];
            event(newResolution, oldResolution, level);
        }
    }

    /**
     * 浏览器窗口大小改变事件
     * @fires g2.maps.IMap#resize
     * @param {Number} newSize 新的窗口尺寸,如：[782, 389]
     * @param {Number} oldSize 旧的窗口尺寸，如：[1440,719]
     */
    map.prototype.onResize = function (newSize, oldSize) {

        for (var i = 0; i < this.events.resize.length; ++i) {
            var event = this.events.resize[i];
            event(newSize, oldSize);
        }
    }
    /**
     *
     */
    map.prototype.onWheel = function (wheel) {
        for (var i = 0; i < this.events.wheel.length; ++i) {
            var event = this.events.wheel[i];
            event(wheel);
        }
    }
    /**
     * 渲染前
     * @fires g2.maps.Map#precompose
     * @param {Event} e 事件对象
     */
    map.prototype.onPreCompose = function (e) {
        for (var i = 0; i < this.events.precompose.length; ++i) {
            var event = this.events.precompose[i];
            event(e);
        }
    }

    /**
     * 渲染完成
     * @fires g2.maps.Map#postrender
     * @param {Event} e 事件对象
     */
    map.prototype.onPostRender = function (e) {
        for (var i = 0; i < this.events.postrender.length; ++i) {
            var event = this.events.postrender[i];
            event(e);
        }
    }

    /**
     * 正在渲染
     * @fires g2.maps.Map#postcompose
     * @param {Event} e 事件对象
     */
    map.prototype.onPostCompose = function (e) {
        for (var i = 0; i < this.events.postcompose.length; ++i) {
            var event = this.events.postcompose[i];
            event(e);
        }
    }
    /**
     * 地图获得焦点的事件
     * @param {Event} e 事件对象
     */
    //map.prototype.onFocus = function (e) {
    //}
    /**
     * 移除地图相关的交互
     */
    map.prototype.removeInteractions = function () {
    }
    /**
     * 重置地图相关的交互
     */
    map.prototype.resumeInteractions = function () {
    }

    /**
     * 开启或关闭图层聚类的散射效果，对所有的聚类图层都起作用，开启后地图处于选择要素状态，地图不能拖动，
     * @param {Boolean} flag true或false
     */
    map.prototype.setClusterScatter = function (flag) {
    }

    return map;

}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by liufeng on 2016/7/18.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {

}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by liufeng on 2017/11/28.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (ClassUtil) {
    var g2 = window.g2 || {};
    window.g2 = g2;
    g2.lang = g2.lang || {};
    //lang
    g2.lang.ClassUtil = ClassUtil;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author by wangyanxin on 2016-07-25.
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

    function createEvents() {
        var events = {};
        events.click = [];
        events.mousemove = [];
        //events.mouseout = [];
        events.mousedown = [];
        events.mouseup = [];
        events.dblclick = [];
        events.extentchanged = [];
        events.resize = [];
        events.resolutionchanged = [];
        events.tick = [];
        return events;
    }

    /**
     * @class
     * @classdesc
     * 专题图接口
     * @alias g2.maps.IPageLayout
     * @returns {g2.maps.IPageLayout} 返回专题图接口
     */
    var pageLayout = function () {
        this.tool = null;
        this.layers = [];
        this.cursor = null;
        this.events = createEvents();
    }

    pageLayout.prototype.init = function (opts) {

    }

    /**
     * 添加图层
     * @param {g2.lys.ILayer} layer 图层对象
     */
    pageLayout.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    }

    /**
     * 获取视野范围
     */
    pageLayout.prototype.getExtent = function () {

    }

    /**
     * 删除图层
     * @param {g2.lys.ILayer} layer 要删除的图层
     */
    pageLayout.prototype.removeLayer = function (layer) {
        var index = this.layers.indexOf(layer);
        if (index > 0) {
            this.layers.splice(index, 1);
        }
    }

    /**
     * 设置鼠标样式
     * @param {Object} cursor 鼠标样式
     */
    pageLayout.prototype.setCursor = function (cursor) {

    }

    /**
     * 返回地图窗口尺寸 px单位
     * @return {Array} 返回地图窗口的尺寸，如[782, 389]
     */
    pageLayout.prototype.getViewSize = function () {

    }

    /**
     * 获取图层数量
     * @returns {Number} 返回图层数量
     */
    pageLayout.prototype.getLayerCount = function () {
        return this.layers.length;
    }

    /**
     * 获取指定索引位置的图层
     * @param {Number} index 索引
     * @returns {g2.lys.ILayer} 返回图层
     */
    pageLayout.prototype.getLayer = function (index) {
        return this.layers[index];
    }

    /**
     * 获取所有图层
     * @returns {g2.lys.ILayer} 返回图层数组
     */
    pageLayout.prototype.getLayers = function () {
        return this.layers;
    }

    /**
     * 获取地图缩放级别
     */
    pageLayout.prototype.getZoomLevel = function () {

    }

    /**
     * 获取分辨率
     */
    pageLayout.prototype.getResolution = function () {

    }

    /**
     * 设置分辨率
     */
    pageLayout.prototype.setResolution = function () {

    }

    /**
     * 获取坐标原点
     */
    pageLayout.prototype.getOrigin = function () {

    }

    /**
     * 查找图层
     * @param {String} name 图层名称
     * @returns {g2.lys.ILayer} 返回图层
     */
    pageLayout.prototype.findLayer = function (name) {
        for (var i = 0; i < this.layers.length; ++i) {
            var layer = this.layers[i];
            if (layer.name == name || layer.id == name) {
                return layer;
            }
        }
        return null;
    }

    /**
     * 监听指定名称的鼠标事件并设置关联的事件处理方法
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    pageLayout.prototype.on = function (name, func) {
        if (name in this.events) {
            var events = this.events[name];
            events.push(func);
        }
    }

    /**
     * 取消监听指定名称的鼠标事件并取消事件处理方法的关联
     * @param {String} name 事件名称
     * @param {Function} func 处理方法名称
     */
    pageLayout.prototype.un = function (name, func) {
        if (name in  this.events) {
            var events = this.events[name];
            for (var i = 0, len = events.length; i < len; ++i) {
                var event = events[i];
                if (event === func) {
                    events.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    /**
     * 获取当前地图比例尺
     */
    pageLayout.prototype.getScale = function () {
    }


    /**
     * 讲页面转换为html元素
     * @param {Function} callback 转换成功回调函数
     * eg:例子中的ele为转换成功后的div元素
     * pageLayout.toHtml(function(ele){});
     */
    pageLayout.prototype.toHtml = function (callback) {

    }

    /**
     * 地图缩放到空间数据定义的全图范围
     */
    pageLayout.prototype.fullExtent = function () {

    }

    /**
     * 地图缩小
     */
    pageLayout.prototype.zoomOut = function () {

    }

    /**
     * 地图放大
     */
    pageLayout.prototype.zoomIn = function () {

    }

    /**
     * 缩放到指定级别
     */
    pageLayout.prototype.zoomTo = function (level) {

    }

    /**
     * 平移几何图形对象
     * @param {g2.geom.Geometry} geometry 几何图形
     */
    pageLayout.prototype.pan = function (geometry) {

    }

    /**
     * 设定指定的坐标点为地图中心点
     * @param {Point} center 地理坐标点
     */
    pageLayout.prototype.setCenter = function (center) {

    }

    /**
     * 获取指定的地理坐标点显示在屏幕上的位置
     * @param {Array} coordinate 地理坐标点[x,y]
     */
    pageLayout.prototype.getPixelFromCoordinate = function (coordinate) {

    }

    /**
     * 获取屏幕上指定像素点对应的地理坐标点
     * @param {Array} pixel 屏幕像素点坐标[x,y]
     */
    pageLayout.prototype.getCoordinateFromPixel = function (pixel) {

    }

    /**
     * 获取当前视图中心点
     */
    pageLayout.prototype.getCenter = function () {

    }

    /**
     * 导出
     * @param {String} name 导出名称
     */
    pageLayout.prototype.export = function (name, callback) {

    }

    /**
     * 停止拖拽
     */
    pageLayout.prototype.stopDragPan = function () {

    }

    /**
     * 继续拖拽
     */
    pageLayout.prototype.resumeDragpan = function () {

    }

    /**
     * 停止双击
     */
    pageLayout.prototype.stopDbClick = function () {

    }

    /**
     * 继续双击
     */
    pageLayout.prototype.resumeDbClick = function () {

    }

    /**
     * 当前正在使用的地图工具
     * @param {g2.cmd.ToolBase} tool 地图工具
     */
    pageLayout.prototype.currentTool = function (tool) {
        if (this.tool != tool) {
            if (this.tool != null) {
                this.tool.deactivate();
            }
            this.tool = tool;
            if (this.tool != null) {
                this.cursor = this.tool.cursor;
            }
        }
    }

    /**
     * 鼠标单击事件
     * @fires g2.maps.IMap#mouseclick
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    pageLayout.prototype.onMouseClick = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseClick(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.click.length; ++i) {
            var event = this.events.click[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标悬停事件
     * @fires IMap#mouseover
     * @param {Event} e 事件对象
     */
    pageLayout.prototype.onMouseOver = function (e) {
        if (this.tool != null) {
            this.tool.onMouseOver(e);
        }
    }

    /**
     * 鼠标按键按下时的事件处理方法
     * @fires IMap#mousedown
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    pageLayout.prototype.onMouseDown = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseDown(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.mousedown.length; ++i) {
            var event = this.events.mousedown[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标按键按下后抬起的事件的处理方法
     * @fires g2.maps.IMap#mouseup
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    pageLayout.prototype.onMouseUp = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseUp(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.mouseup.length; ++i) {
            var event = this.events.mouseup[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 鼠标移动事件处理方法
     * @fires g2.maps.IMap#mousemove
     * @param {Number} button 按下的鼠标按键
     * @param {Number} shift 是否同时按下的键盘上的shift键
     * @param {Number} screenX 事件发生时鼠标在屏幕上的X坐标
     * @param {Number} screenY 事件发生时鼠标在屏幕上的Y坐标
     * @param {Number} mapX 鼠标在地图上的X坐标
     * @param {Number} mapY 鼠标在地图上的Y坐标
     * @param {Number} handle 该事件是否已经不需要再处理
     */
    pageLayout.prototype.onMouseMove = function (button, shift, screenX, screenY, mapX, mapY, handle) {
        if (!!this.tool) {
            this.tool.onMouseMove(button, shift, screenX, screenY, mapX, mapY, handle);
        }
        for (var i = 0; i < this.events.mousemove.length; ++i) {
            var event = this.events.mousemove[i];
            event(button, shift, screenX, screenY, mapX, mapY, handle);
        }
    }

    /**
     * 地图可视范围改变事件
     * @fires g2.maps.IMap#extentchanged
     * @param {Number} left 左上角X坐标
     * @param {Number} top 左上角Y坐标
     * @param {Number} right 右下角X坐标
     * @param {Number} bottom 右下角Y坐标
     */
    pageLayout.prototype.onExtentChanged = function (left, top, right, bottom) {
        for (var i = 0; i < this.events.extentchanged.length; ++i) {
            var event = this.events.extentchanged[i];
            event(left, top, right, bottom);
        }
    }

    /**
     * 计时器
     * @param time 当前的时间
     */
    pageLayout.prototype.onTick = function (time) {
        for (var i = 0; i < this.events.tick.length; ++i) {
            var event = this.events.tick[i];
            event(time);
        }
    }

    /**
     * 鼠标双击事件
     * @fires g2.maps.IMap#dblclick
     * @param {Number} pixelX 屏幕坐标x
     * @param {Number} pixelY 屏幕坐标y
     * @param {Number} coordinateX 地图坐标x
     * @param {Number} coordinateY 地图坐标y
     */
    pageLayout.prototype.onDblclick = function (pixelX, pixelY, coordinateX, coordinateY) {
        for (var i = 0; i < this.events.dblclick.length; ++i) {
            var event = this.events.dblclick[i];
            event(pixelX, pixelY, coordinateX, coordinateY);
        }
    }

    /**
     * 比例尺改变事件
     * @fires g2.maps.IMap#resolutionchanged
     * @param {Number} newResolution 新的分辨率
     * @param {Number} oldResolution 旧的分辨率值
     * @param {Number} level 当前层级
     */
    pageLayout.prototype.onResolutionChanged = function (newResolution, oldResolution, level) {
        for (var i = 0; i < this.events.resolutionchanged.length; ++i) {
            var event = this.events.resolutionchanged[i];
            event(newResolution, oldResolution, level);
        }
    }

    /**
     * 浏览器窗口大小改变事件
     * @fires g2.maps.IMap#resize
     * @param {Number} newSize 新的窗口尺寸,如：[782, 389]
     * @param {Number} oldSize 旧的窗口尺寸，如：[1440,719]
     */
    pageLayout.prototype.onResize = function (newSize, oldSize) {
        for (var i = 0; i < this.events.resize.length; ++i) {
            var event = this.events.resize[i];
            event(newSize, oldSize);
        }
    }

    //pageLayout.prototype.onFocus = function (e) {
    //}

    return pageLayout;
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by liufeng on 2017/11/3.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2),__webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {

}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by liufeng on 2017/11/28.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {

}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by liufeng on 2017/11/28.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1),__webpack_require__(4),__webpack_require__(13),__webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Map,PageLayOut,OlMap,OlPageLayOut) {
        var g2 = window.g2 || {};
        window.g2 = g2;
        g2.map = g2.map || {};
        //map
        g2.map.IMap = Map;
        g2.map.IPageLayOut = PageLayOut;
        g2.map.Map = OlMap;
        g2.map.PageLayOut = OlPageLayOut;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author by ligang on 2014/10/14
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(5), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function (ClassUtil, Map, ol, $) {
    var olmap = function (opts) {
        var optss = opts || {};
        Map.call(this, optss);
    }
    ClassUtil.extend2(olmap, Map);

    return olmap;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author by wangyanxin on 2016-07-25.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (ClassUtil,PageLayOut,ol) {
        var pageLayout = function (opts) {
            var optss = opts || {};
            PageLayout.call(this, opts);
        }

        ClassUtil.extend2(pageLayout, PageLayout);

        return pageLayout;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ })
/******/ ]);
});