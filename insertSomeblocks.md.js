logseq.kits.insertSomeBlocks = insertSomeBlocks;


function insertSomeBlocks(source, target, options, unless) {

    const buttonElement = event.target.closest("button[data-kit]");

    const datasetArguments = {
        source: buttonElement.dataset.source,
        target: buttonElement.dataset.target,
        options: buttonElement.dataset.options,
        unlessMacro: buttonElement.dataset.unlessMacro,
        element: buttonElement
    };
    const functionArguments = {
        source: source,
        target: target,
        options: options,
        unless: unless,
        element: buttonElement
    };

    console.group("Argument Object");
    const argumentObject = ((
        sourceArg = source,
        targetArg = target,
        optionsArg = options,
        unlessArg = unless,
        element = buttonElement) => {

        const triggeringBlockUuid = element.closest(".ls-block").getAttribute("blockid");
        const processedTargetUUID = ((el = element, fromArg = targetArg) => {
            if (el.dataset.target) {
                // Use the user-defined data-attribute based UUID
                console.log(`el.dataset.target: ${el.dataset.target}`);
                return el.dataset.target;
            }
            if (fromArg != undefined) {
                // Use the UUID passed to the kit as an argument
                console.log(`fromArg not undefined: ${fromArg}`);
                return fromArg;
            }

            console.log("Using UUID from closest element")
            return el.closest(".ls-block").getAttribute("blockid")
        })();

        return {
            sourceUuid: sourceArg ? sourceArg : element.dataset.source,
            targetUuid: processedTargetUUID,
            triggeringBlockUuid: element.closest(".ls-block").getAttribute("blockid"),
            optionsString: element.dataset.options ? element.dataset.options : undefined,
            unlessMacro: element.dataset.unlessMacro ? element.dataset.unlessMacro : undefined
        }
    })();
    console.table(argumentObject);
    // console.log(`argumentObject:\n${JSON.stringify(argumentObject, null, 2)}`);
    console.groupEnd();



    /**
     * The main function that inserts the blocks.
     * @param {Object} argument - The argument object containing the source UUID, target UUID, options, and unless macro.
     * @returns {Promise} A promise that resolves when the blocks are inserted.
     */
    const batchInsertPromise = (async (argument = argumentObject, element = buttonElement) => {

        /**
         * Get the block data for the source UUID and all its children.
         */
        const blockAndChildren = await (async (blockId = argument.sourceUuid) => {
            if (!blockId) {
                throw new Error('Source UUID is required');
            }
            const blockData = await logseq.api.get_block(blockId, { includeChildren: true });
            return blockData;
        })();
        // console.log(`blockAndChildren:\n ${JSON.stringify(blockAndChildren,null,2)}`);


        /**
         * Structure the block data for use with the logseq.api.insert_batch_block 
         * function by running a recrusive function on the data tree.
         * 
         * @param {Object} blockData - The block data object to be formatted.
         */
        const structuredBlockData = ((blockData = blockAndChildren) => {
            const formatBlockData = (block) => {
                const formattedBlock = {
                    content: block.content
                };

                if (block.children && block.children.length > 0) {
                    formattedBlock.children = block.children.map(child => formatBlockData(child));
                }
                return formattedBlock;
            };
            return formatBlockData(blockData);
        })();
        // console.log(`structuredBlockData:\n${JSON.stringify(structuredBlockData,null,1)}`);


        /**
         * Process the options string into a javascript object.
         * 
         * Options for the insert_batch_block() function are passed to this script as an
         * object-like string. Convert the string to an actual object.
         * 
         * @returns {Object} The processed options object.
         */
        const processedBatchOptions = ((options = argument.optionsString) => {
            if (!options) return { sibling: false, before: false };
            const result = {};
            const keyValuePairs = options.split(';');
            for (let pair of keyValuePairs) {
                pair = pair.trim();
                if (!pair) continue;

                const colonIndex = pair.indexOf(':');
                if (colonIndex === -1) throw new Error(`Invalid pair: ${pair}`);
                const key = pair.slice(0, colonIndex).trim();
                const value = pair.slice(colonIndex + 1).trim();
                // Since the value is a string, convert it into a data type
                result[key] = ((inputString = value) => {
                    switch (inputString) {
                        case 'true':
                            return true;
                        case 'false':
                            return false;
                        case 'null':
                            return null;
                        case 'undefined':
                            return undefined;
                        case (!isNaN(inputString) && inputString !== ''):
                            return Number(inputString);
                        default:
                            return inputString;
                    }
                })();
            }
            return result;
        })();

        const processedTargetId = argument.targetUuid;
        return insertOperation = (async (
            source = [structuredBlockData],
            target = processedTargetId,
            options = processedBatchOptions) => {

            if (!target) throw new Error('Target UUID is required');
            await logseq.api.insert_batch_block(
                target,
                source,
                options);
        })();

    })();

    return new Promise(async (resolve) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        await logseq.api.exit_editing_mode();
        resolve(await batchInsertPromise);
    });
};