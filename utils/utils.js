export function isImageURL(url) {
    // 提取链接的文件扩展名
    const extension = url.split('.').pop().toLowerCase();
  
    // 支持的图片扩展名数组
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  
    // 检查扩展名是否在支持的数组中
    return supportedExtensions.includes(extension);
}
  