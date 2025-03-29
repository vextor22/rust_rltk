let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    function addToExternrefTable0(obj) {
        const idx = wasm.__externref_table_alloc();
        wasm.__wbindgen_export_2.set(idx, obj);
        return idx;
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm.__wbindgen_exn_store(idx);
        }
    }

    let WASM_VECTOR_LEN = 0;

    let cachedUint8ArrayMemory0 = null;

    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachedDataViewMemory0 = null;

    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
        }
        return cachedDataViewMemory0;
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    function getArrayU8FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }
    function __wbg_adapter_22(arg0, arg1, arg2) {
        wasm.closure203_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_27(arg0, arg1) {
        wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5b96d38c5089d934(arg0, arg1);
    }

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_attachShader_3d4eb6af9e3e7bd1 = function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        };
        imports.wbg.__wbg_attachShader_94e758c8b5283eb2 = function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        };
        imports.wbg.__wbg_bindBuffer_309c9a6c21826cf5 = function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindBuffer_f32f587f1c2962a7 = function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindFramebuffer_bd02c8cc707d670f = function(arg0, arg1, arg2) {
            arg0.bindFramebuffer(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindFramebuffer_e48e83c0f973944d = function(arg0, arg1, arg2) {
            arg0.bindFramebuffer(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindTexture_a6e795697f49ebd1 = function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindTexture_bc8eb316247f739d = function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_bindVertexArrayOES_da8e7059b789629e = function(arg0, arg1) {
            arg0.bindVertexArrayOES(arg1);
        };
        imports.wbg.__wbg_bindVertexArray_6b4b88581064b71f = function(arg0, arg1) {
            arg0.bindVertexArray(arg1);
        };
        imports.wbg.__wbg_blendFunc_9454884a3cfd2911 = function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        };
        imports.wbg.__wbg_blendFunc_c3b74be5a39c665f = function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        };
        imports.wbg.__wbg_bufferData_3261d3e1dd6fc903 = function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        };
        imports.wbg.__wbg_bufferData_33c59bf909ea6fd3 = function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        };
        imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_charCode_3531af7ed7ab9ef5 = function(arg0) {
            const ret = arg0.charCode;
            return ret;
        };
        imports.wbg.__wbg_clearColor_d39507085c98a678 = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearColor(arg1, arg2, arg3, arg4);
        };
        imports.wbg.__wbg_clearColor_f0fa029dfbcc1982 = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearColor(arg1, arg2, arg3, arg4);
        };
        imports.wbg.__wbg_clear_62b9037b892f6988 = function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        };
        imports.wbg.__wbg_clear_f8d5f3c348d37d95 = function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        };
        imports.wbg.__wbg_code_459c120478e1ab6e = function(arg0, arg1) {
            const ret = arg1.code;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_compileShader_0ad770bbdbb9de21 = function(arg0, arg1) {
            arg0.compileShader(arg1);
        };
        imports.wbg.__wbg_compileShader_2307c9d370717dd5 = function(arg0, arg1) {
            arg0.compileShader(arg1);
        };
        imports.wbg.__wbg_createBuffer_7a9ec3d654073660 = function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createBuffer_9886e84a67b68c89 = function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createFramebuffer_7824f69bba778885 = function(arg0) {
            const ret = arg0.createFramebuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createFramebuffer_c8d70ebc4858051e = function(arg0) {
            const ret = arg0.createFramebuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createProgram_8ff56c485f3233d0 = function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createProgram_da203074cafb1038 = function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createShader_4a256a8cc9c1ce4f = function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createShader_983150fb1243ee56 = function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createTexture_9c536c79b635fdef = function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createTexture_bfaa54c0cd22e367 = function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createVertexArrayOES_991b44f100f93329 = function(arg0) {
            const ret = arg0.createVertexArrayOES();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_createVertexArray_e435029ae2660efd = function(arg0) {
            const ret = arg0.createVertexArray();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_crypto_fda074615ac88d76 = function(arg0) {
            const ret = arg0.crypto;
            return ret;
        };
        imports.wbg.__wbg_disable_2702df5b5da5dd21 = function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        };
        imports.wbg.__wbg_disable_8b53998501a7a85b = function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        };
        imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
            const ret = arg0.document;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_drawArrays_6acaa2669c105f3a = function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        };
        imports.wbg.__wbg_drawArrays_6d29ea2ebc0c72a2 = function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        };
        imports.wbg.__wbg_drawElements_16199ef1cc58b16a = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
        };
        imports.wbg.__wbg_drawElements_65cb4b099bd7d4ac = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
        };
        imports.wbg.__wbg_enableVertexAttribArray_607be07574298e5e = function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        };
        imports.wbg.__wbg_enableVertexAttribArray_93c3d406a41ad6c7 = function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        };
        imports.wbg.__wbg_enable_51114837e05ee280 = function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        };
        imports.wbg.__wbg_enable_d183fef39258803f = function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        };
        imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        };
        imports.wbg.__wbg_framebufferTexture2D_81a565732bd5d8fe = function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
        };
        imports.wbg.__wbg_framebufferTexture2D_ed855d0b097c557a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
        };
        imports.wbg.__wbg_getContext_e9cf379449413580 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments) };
        imports.wbg.__wbg_getElementById_f827f0d6648718a8 = function(arg0, arg1, arg2) {
            const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_getError_578ee28e31637d2f = function(arg0) {
            const ret = arg0.getError();
            return ret;
        };
        imports.wbg.__wbg_getError_d749701e28a45150 = function(arg0) {
            const ret = arg0.getError();
            return ret;
        };
        imports.wbg.__wbg_getExtension_ff0fb1398bcf28c3 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments) };
        imports.wbg.__wbg_getModifierState_3bb4eca2cd4bbaa1 = function(arg0, arg1, arg2) {
            const ret = arg0.getModifierState(getStringFromWasm0(arg1, arg2));
            return ret;
        };
        imports.wbg.__wbg_getProgramInfoLog_631c180b1b21c8ed = function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_getProgramInfoLog_a998105a680059db = function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_getProgramParameter_0c411f0cd4185c5b = function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_getProgramParameter_360f95ff07ac068d = function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_getRandomValues_70fb443697b71181 = function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments) };
        imports.wbg.__wbg_getShaderInfoLog_7e7b38fb910ec534 = function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_getShaderInfoLog_f59c3112acc6e039 = function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_getShaderParameter_511b5f929074fa31 = function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_getShaderParameter_6dbe0b8558dc41fd = function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_getUniformLocation_657a2b6d102bd126 = function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_getUniformLocation_838363001c74dc21 = function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLCanvasElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_WebGl2RenderingContext_2b6045efeb76568d = function(arg0) {
            let result;
            try {
                result = arg0 instanceof WebGL2RenderingContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_keyCode_237a8d1a040910b8 = function(arg0) {
            const ret = arg0.keyCode;
            return ret;
        };
        imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_linkProgram_067ee06739bdde81 = function(arg0, arg1) {
            arg0.linkProgram(arg1);
        };
        imports.wbg.__wbg_linkProgram_e002979fe36e5b2a = function(arg0, arg1) {
            arg0.linkProgram(arg1);
        };
        imports.wbg.__wbg_log_99195bc112190358 = function(arg0, arg1) {
            console.log(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_msCrypto_ec7aeb7406346947 = function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        };
        imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
            const ret = new Error();
            return ret;
        };
        imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_now_807e54c39636c349 = function() {
            const ret = Date.now();
            return ret;
        };
        imports.wbg.__wbg_now_d18023d54d4e5500 = function(arg0) {
            const ret = arg0.now();
            return ret;
        };
        imports.wbg.__wbg_offsetX_adb14e39bdd32e22 = function(arg0) {
            const ret = arg0.offsetX;
            return ret;
        };
        imports.wbg.__wbg_offsetY_e88dc24ec0418dd4 = function(arg0) {
            const ret = arg0.offsetY;
            return ret;
        };
        imports.wbg.__wbg_performance_c185c0cdc2766575 = function(arg0) {
            const ret = arg0.performance;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_randomFillSync_8046cfbe3db01d42 = function() { return handleError(function (arg0, arg1, arg2) {
            arg0.randomFillSync(getArrayU8FromWasm0(arg1, arg2));
        }, arguments) };
        imports.wbg.__wbg_requestAnimationFrame_d7fd890aaefc3246 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_require_91014e0e4c1e0310 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.require(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments) };
        imports.wbg.__wbg_self_2088a6d9fa948180 = function() { return handleError(function () {
            const ret = self.self;
            return ret;
        }, arguments) };
        imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_setheight_da683a33fa99843c = function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        };
        imports.wbg.__wbg_setonkeydown_6f8d021ecb13db5a = function(arg0, arg1) {
            arg0.onkeydown = arg1;
        };
        imports.wbg.__wbg_setonkeyup_d38a5e036e4265aa = function(arg0, arg1) {
            arg0.onkeyup = arg1;
        };
        imports.wbg.__wbg_setonmousedown_c721b8076d7c9739 = function(arg0, arg1) {
            arg0.onmousedown = arg1;
        };
        imports.wbg.__wbg_setonmousemove_e3e4f7801ef476ef = function(arg0, arg1) {
            arg0.onmousemove = arg1;
        };
        imports.wbg.__wbg_setonmouseup_a34038e6681a3de2 = function(arg0, arg1) {
            arg0.onmouseup = arg1;
        };
        imports.wbg.__wbg_setwidth_c5fed9f5e7f0b406 = function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        };
        imports.wbg.__wbg_shaderSource_72d3e8597ef85b67 = function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        };
        imports.wbg.__wbg_shaderSource_ad0087e637a35191 = function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        };
        imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_MODULE_7781e47b50010688 = function() {
            const ret = module;
            return ret;
        };
        imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_texImage2D_06281e677e3f6909 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
        }, arguments) };
        imports.wbg.__wbg_texImage2D_297bb8474cd4e8b8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
        }, arguments) };
        imports.wbg.__wbg_texParameteri_8112b26b3c360b7e = function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        };
        imports.wbg.__wbg_texParameteri_ef50743cb94d507e = function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        };
        imports.wbg.__wbg_uniform1i_5ddd9d8ccbd390bb = function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        };
        imports.wbg.__wbg_uniform1i_ed95b6129dce4d84 = function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        };
        imports.wbg.__wbg_uniform3f_99e237fdba99fca9 = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniform3f(arg1, arg2, arg3, arg4);
        };
        imports.wbg.__wbg_uniform3f_c40bec60fca69774 = function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniform3f(arg1, arg2, arg3, arg4);
        };
        imports.wbg.__wbg_useProgram_473bf913989b6089 = function(arg0, arg1) {
            arg0.useProgram(arg1);
        };
        imports.wbg.__wbg_useProgram_9b2660f7bb210471 = function(arg0, arg1) {
            arg0.useProgram(arg1);
        };
        imports.wbg.__wbg_vertexAttribPointer_550dc34903e3d1ea = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        };
        imports.wbg.__wbg_vertexAttribPointer_7a2a506cdbe3aebc = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        };
        imports.wbg.__wbindgen_boolean_get = function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = arg0.original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper2145 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 476, __wbg_adapter_27);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper439 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 204, __wbg_adapter_22);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper441 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 204, __wbg_adapter_22);
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm.__wbindgen_export_2;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return ret;
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        return imports;
    }

    function __wbg_init_memory(imports, memory) {

    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedDataViewMemory0 = null;
        cachedUint8ArrayMemory0 = null;


        wasm.__wbindgen_start();
        return wasm;
    }

    function initSync(module) {
        if (wasm !== undefined) return wasm;


        if (typeof module !== 'undefined') {
            if (Object.getPrototypeOf(module) === Object.prototype) {
                ({module} = module)
            } else {
                console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
            }
        }

        const imports = __wbg_get_imports();

        __wbg_init_memory(imports);

        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }

        const instance = new WebAssembly.Instance(module, imports);

        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (typeof module_or_path !== 'undefined') {
            if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
                ({module_or_path} = module_or_path)
            } else {
                console.warn('using deprecated parameters for the initialization function; pass a single object instead')
            }
        }

        if (typeof module_or_path === 'undefined' && typeof script_src !== 'undefined') {
            module_or_path = script_src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        __wbg_init_memory(imports);

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();
