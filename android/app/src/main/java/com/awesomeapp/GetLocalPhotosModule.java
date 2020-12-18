package com.awesomeapp;
import android.net.Uri;
import android.provider.MediaStore;
import android.database.Cursor;
import java.io.File;
import org.json.JSONArray;
import org.json.JSONObject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class GetLocalPhotosModule extends ReactContextBaseJavaModule {

    GetLocalPhotosModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GetLocalPhotos";
    }

    @ReactMethod
    private void getAllPhotoInfo(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                JSONArray allPhotosTemp = new JSONArray(); //所有照片
                JSONObject mediaBeen = null;
                Uri mImageUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                String[] projImage = { MediaStore.Images.Media._ID
                        , MediaStore.Images.Media.DATA
                        ,MediaStore.Images.Media.SIZE
                        ,MediaStore.Images.Media.DISPLAY_NAME};
                Cursor mCursor = getReactApplicationContext().getContentResolver().query(mImageUri,
                        projImage,
                        MediaStore.Images.Media.MIME_TYPE + "=? or " + MediaStore.Images.Media.MIME_TYPE + "=?",
                        new String[]{"image/jpeg", "image/png"},
                        MediaStore.Images.Media.DATE_MODIFIED+" desc");

                if(mCursor!=null){
                    while (mCursor.moveToNext()) {
                        // 获取图片的路径
                        String path = mCursor.getString(mCursor.getColumnIndex(MediaStore.Images.Media.DATA));
                        int size = mCursor.getInt(mCursor.getColumnIndex(MediaStore.Images.Media.SIZE))/1024;
                        String displayName = mCursor.getString(mCursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME));
                        // 获取该图片的父路径名
                        String dirPath = new File(path).getParentFile().getAbsolutePath();
                        //存储对应关系
                        mediaBeen = new JSONObject();
                        try{
                            mediaBeen.put("path", "file://" + path); // 返回图片路径
                            mediaBeen.put("size", size); // 返回图大小
                            mediaBeen.put("displayName", displayName); // 返回图片名称
                            mediaBeen.put("dirPath", dirPath); // 返回图片所在文件夹名称
                        }
                        catch(Exception e){
                        }
                        allPhotosTemp.put(mediaBeen);
                        mediaBeen = null;
                    }
                    promise.resolve(allPhotosTemp.toString());
                    mCursor.close();
                }
            }
        }).start();
    }
}