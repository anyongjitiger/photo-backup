package com.awesomeapp;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.database.Cursor;
import java.io.File;
import org.json.JSONArray;
import org.json.JSONObject;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class GetLocalVideosModule extends ReactContextBaseJavaModule {
    GetLocalVideosModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "GetLocalVideos";
    }

    @ReactMethod
    private void getAllVideoInfo(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                JSONArray allVideosTemp = new JSONArray(); //所有视频
                JSONObject mediaBeen = null;
                Uri mVideoUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                String[] projVideo = { MediaStore.Video.Media._ID
                        , MediaStore.Video.Media.DATA
                        ,MediaStore.Video.Media.SIZE
                        ,MediaStore.Video.Media.DISPLAY_NAME};
                String[] thumbColumns = { MediaStore.Video.Thumbnails._ID
                    , MediaStore.Video.Thumbnails.DATA
                    ,MediaStore.Video.Thumbnails.VIDEO_ID
                    ,MediaStore.Video.Thumbnails.KIND};
                Cursor mCursor = getReactApplicationContext().getContentResolver().query(mVideoUri,
                        projVideo,
                        MediaStore.Video.Media.MIME_TYPE + "=? or "
                                + MediaStore.Video.Media.MIME_TYPE + "=? or " + MediaStore.Video.Media.MIME_TYPE + "=?",
                        new String[]{"video/mp4", "video/quicktime", "video/mpeg"},
                        MediaStore.Video.Media.DATE_MODIFIED+" desc");

                if(mCursor!=null){
                    while (mCursor.moveToNext()) {
                        // 获取图片的路径
                        int id = mCursor.getInt(mCursor.getColumnIndex(MediaStore.Video.Media._ID));
                        Cursor thumbCursor = getReactApplicationContext().getContentResolver()
                            .query(MediaStore.Video.Thumbnails.EXTERNAL_CONTENT_URI,
                        thumbColumns, MediaStore.Video.Thumbnails.VIDEO_ID
                                + "=" + id, null, null);
                        String thumbPath = "";
                        if (thumbCursor.moveToFirst()) {
                            thumbPath = thumbCursor.getString(thumbCursor
                                    .getColumnIndex(MediaStore.Video.Thumbnails.DATA));
                            Bitmap bitmap= BitmapFactory.decodeFile(thumbPath);
                        }

                        String path = mCursor.getString(mCursor.getColumnIndex(MediaStore.Video.Media.DATA));
                        int size = mCursor.getInt(mCursor.getColumnIndex(MediaStore.Video.Media.SIZE))/1024;
                        String displayName = mCursor.getString(mCursor.getColumnIndex(MediaStore.Video.Media.DISPLAY_NAME));
                        // 获取该图片的父路径名
                        String dirPath = new File(path).getParentFile().getAbsolutePath();
                        //存储对应关系
                        mediaBeen = new JSONObject();
                        try{
                            mediaBeen.put("path", "file://" + path); // 返回图片路径
                            mediaBeen.put("size", size); // 返回图大小
                            mediaBeen.put("displayName", displayName); // 返回图片名称
                            mediaBeen.put("dirPath", dirPath); // 返回图片所在文件夹名称
                            mediaBeen.put("thumbPath", "file://" + thumbPath);
                        }
                        catch(Exception e){
                        }
                        allVideosTemp.put(mediaBeen);
                        mediaBeen = null;
                    }
                    promise.resolve(allVideosTemp.toString());
                    mCursor.close();
                }
            }
        }).start();
    }
}
