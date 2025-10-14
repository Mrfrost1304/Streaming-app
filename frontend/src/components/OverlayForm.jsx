import React from "react";
import { Save, X, Type, Image, Palette, Text } from "lucide-react";
import { useStream } from "../context/StreamContext.jsx";
import { useStreamAPI } from "../hooks/useStreamAPI.jsx";

const OverlayForm = () => {
  const { state, actions } = useStream();
  const { createOverlay, updateOverlay } = useStreamAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.overlayForm.content.trim()) {
      alert("Please enter overlay content");
      return;
    }

    try {
      if (state.selectedOverlay) {
        await updateOverlay(state.selectedOverlay, state.overlayForm);
        actions.setSelectedOverlay(null);
      } else {
        await createOverlay(state.overlayForm);
      }
      actions.setShowOverlayForm(false);
      actions.resetOverlayForm();
    } catch (err) {
      alert("Failed to save overlay. Please try again.");
    }
  };

  const handleClose = () => {
    actions.setShowOverlayForm(false);
    actions.setSelectedOverlay(null);
    actions.resetOverlayForm();
  };

  return (
    <div className="mb-6 p-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-3xl border border-purple-500/20 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-xl">
            {state.overlayForm.type === "text" ? (
              <Type className="w-6 h-6 text-purple-400" />
            ) : (
              <Image className="w-6 h-6 text-purple-400" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-white">
            {state.selectedOverlay ? "Edit Overlay" : "Create Overlay"}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overlay Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            Overlay Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => actions.setOverlayForm({ type: "text" })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 ${
                state.overlayForm.type === "text"
                  ? "border-purple-500 bg-purple-500/10 text-purple-300"
                  : "border-slate-600 bg-slate-700/50 text-gray-400 hover:border-slate-500"
              }`}
            >
              <Type className="w-5 h-5" />
              <span className="font-medium">Text</span>
            </button>
            <button
              type="button"
              onClick={() => actions.setOverlayForm({ type: "image" })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 ${
                state.overlayForm.type === "image"
                  ? "border-purple-500 bg-purple-500/10 text-purple-300"
                  : "border-slate-600 bg-slate-700/50 text-gray-400 hover:border-slate-500"
              }`}
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Image</span>
            </button>
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            {state.overlayForm.type === "text" ? "Text Content" : "Image URL"}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={
                state.overlayForm.type === "text"
                  ? "Enter your text here..."
                  : "https://example.com/image.jpg"
              }
              value={state.overlayForm.content}
              onChange={(e) =>
                actions.setOverlayForm({ content: e.target.value })
              }
              className="w-full px-4 py-4 bg-slate-700/60 text-white rounded-xl border border-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 placeholder-gray-400"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {state.overlayForm.type === "text" ? (
                <Text className="w-5 h-5 text-gray-400" />
              ) : (
                <Image className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Text Styling Options */}
        {state.overlayForm.type === "text" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Text Color */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Text Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={state.overlayForm.style.color}
                    onChange={(e) =>
                      actions.setOverlayForm({
                        style: {
                          ...state.overlayForm.style,
                          color: e.target.value,
                        },
                      })
                    }
                    className="w-full h-12 bg-slate-700/60 rounded-xl border border-slate-600 cursor-pointer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Palette className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              {/* Position Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200">
                    Position X (px)
                  </label>
                  <input
                    type="number"
                    placeholder="X position"
                    value={state.overlayForm.position?.x || 0}
                    onChange={(e) =>
                      actions.setOverlayForm({
                        position: {
                          ...state.overlayForm.position,
                          x: parseInt(e.target.value) || 0,
                          y: state.overlayForm.position?.y || 0,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700/60 text-white rounded-xl border border-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-200">
                    Position Y (px)
                  </label>
                  <input
                    type="number"
                    placeholder="Y position"
                    value={state.overlayForm.position?.y || 0}
                    onChange={(e) =>
                      actions.setOverlayForm({
                        position: {
                          ...state.overlayForm.position,
                          x: state.overlayForm.position?.x || 0,
                          y: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700/60 text-white rounded-xl border border-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">
                  Font Size
                </label>
                <input
                  type="number"
                  placeholder="24"
                  min="8"
                  max="72"
                  value={state.overlayForm.style.fontSize}
                  onChange={(e) =>
                    actions.setOverlayForm({
                      style: {
                        ...state.overlayForm.style,
                        fontSize: parseInt(e.target.value) || 24,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700/60 text-white rounded-xl border border-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-200">
                Background
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={state.overlayForm.style.backgroundColor}
                  onChange={(e) =>
                    actions.setOverlayForm({
                      style: {
                        ...state.overlayForm.style,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-12 bg-slate-700/60 rounded-xl border border-slate-600 cursor-pointer"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-5 h-5 rounded bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25"
          >
            <Save className="w-5 h-5" />
            {state.selectedOverlay ? "Update Overlay" : "Create Overlay"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OverlayForm;
