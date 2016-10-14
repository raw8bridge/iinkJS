import { modelLogger as logger } from '../../../configuration/LoggerConfig';
import MyScriptJSConstants from '../../../configuration/MyScriptJSConstants';
import * as InkModel from '../../../model/InkModel';


export function generateRenderingResult(model) {
  const mutatedModel = InkModel.clone(model);

  if (mutatedModel.rawResult.result && mutatedModel.rawResult.result.scratchOutResults) {
    mutatedModel.rawResult.result.scratchOutResults.forEach((scratchOut) => {
      scratchOut.erasedInkRanges.forEach((inkRangeToErase) => {
        mutatedModel.recognizedStrokes[inkRangeToErase.component].toBeRemove = true;
      });
      scratchOut.inkRanges.forEach((inkRangeToErase) => {
        mutatedModel.recognizedStrokes[inkRangeToErase.component].toBeRemove = true;
      });
    });
  }
  // We recopy the recognized strokes to flag them as toBeRemove if they are scratched out or map with a symbol
  const recognizedComponents = {
    strokeList: [],
    // symbolList : [], no math symbol managed yet
    inkRange: {}
  };
  recognizedComponents.strokeList = mutatedModel.recognizedStrokes.filter(stroke => !stroke.toBeRemove);
  recognizedComponents.inkRange.firstStroke = 0;
  recognizedComponents.inkRange.lastStroke = model.recognizedStrokes.length - 1;
  mutatedModel.recognizedComponents = recognizedComponents;
  logger.debug('Building the rendering model', mutatedModel);
  return mutatedModel;
}

export function getAvailableRecognitionSlots() {
  const availableRecognitionTypes = {};
  availableRecognitionTypes[MyScriptJSConstants.RecognitionSlot.ON_PEN_UP] = true;
  availableRecognitionTypes[MyScriptJSConstants.RecognitionSlot.ON_DEMAND] = true;
  availableRecognitionTypes[MyScriptJSConstants.RecognitionSlot.ON_TIME_OUT] = true;
  return availableRecognitionTypes;
}