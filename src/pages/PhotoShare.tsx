import React, { useState } from 'react';
import { Camera, Image, Send, X, Download, Heart, Share2, Sparkles, Type, Sticker, Edit3, Save } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { postcardTemplates, photoSpots } from '@/data/social';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types';

const PhotoShare: React.FC = () => {
  const { user, addPhoto } = useAppStore();
  const [mode, setMode] = useState<'camera' | 'postcard' | 'album'>('camera');
  const [selectedSpot, setSelectedSpot] = useState(photoSpots[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(postcardTemplates[0]);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const [postcardText, setPostcardText] = useState('来自元宇宙博物馆的问候');
  const [showShareModal, setShowShareModal] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editText, setEditText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const filters = [
    { name: '原图', class: '' },
    { name: '复古', class: 'sepia' },
    { name: '黑白', class: 'grayscale' },
    { name: '梦幻', class: 'brightness-110 saturate-125' },
    { name: '冷调', class: 'hue-rotate-30' },
  ];

  const stickers = ['🏛️', '🎨', '✨', '💎', '🦕', '🏺', '📜', '🖼️'];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };

  const handleTakePhoto = () => {
    const photoMap: Record<string, string> = {
      'spot-1': '/images/photo-lobby.svg',
      'spot-2': '/images/photo-ding.svg',
      'spot-3': '/images/photo-dino.svg',
      'spot-4': '/images/photo-silk.svg',
      'spot-5': '/images/photo-gallery.svg',
    };
    const photoUrl = photoMap[selectedSpot.id] || '/images/photo-lobby.svg';
    setPhotoTaken(photoUrl);
  };

  const handleSavePhoto = () => {
    if (photoTaken) {
      const photoId = `photo-${Date.now()}`;
      addPhoto(photoId, photoTaken, selectedSpot.name + '留影', selectedSpot.name, { type: 'photo' });
      setShowShareModal(true);
      showToast('照片已保存到相册');
    }
  };

  const handleSavePostcard = () => {
    if (!postcardText.trim()) {
      showToast('请输入明信片寄语', 'error');
      return;
    }
    const photoId = `postcard-${Date.now()}`;
    addPhoto(photoId, '/images/hall-special.svg', '我的明信片', selectedTemplate.name, {
      type: 'postcard',
      templateColor: selectedTemplate.color,
      text: postcardText,
    });
    setShowShareModal(true);
    showToast('明信片已保存到相册');
  };

  const handleReset = () => {
    setPhotoTaken(null);
    setFilterIndex(0);
    setPostcardText('来自元宇宙博物馆的问候');
  };

  const handleOpenPhotoDetail = (photo: Photo) => {
    setSelectedPhoto(photo);
    setEditText(photo.text || '');
    setIsEditing(false);
  };

  const handleClosePhotoDetail = () => {
    setSelectedPhoto(null);
    setIsEditing(false);
    setEditText('');
  };

  const handleShareFromDetail = () => {
    setShowShareModal(true);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditText(selectedPhoto?.text || '');
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveAsNew = () => {
    if (!selectedPhoto) return;
    if (!editText.trim()) {
      showToast('请输入明信片寄语', 'error');
      return;
    }
    const photoId = `postcard-${Date.now()}`;
    addPhoto(photoId, selectedPhoto.image, selectedPhoto.title + ' (副本)', selectedPhoto.location, {
      type: 'postcard',
      templateColor: selectedPhoto.templateColor || '#D4AF37',
      text: editText,
    });
    showToast('明信片已另存为新卡片');
    setIsEditing(false);
    handleClosePhotoDetail();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <div className="stars-bg opacity-30" />
      
      {/* 顶部栏 */}
      <header className="relative z-10 px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gold-gradient text-center mb-4">
          拍照分享
        </h1>
        
        {/* 模式切换 */}
        <div className="flex gap-2 glass-card p-1">
          {[
            { id: 'camera', label: '拍照', icon: Camera },
            { id: 'postcard', label: '明信片', icon: Image },
            { id: 'album', label: '相册', icon: Image },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id as 'camera' | 'postcard' | 'album')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gold text-space-dark'
                    : 'text-text-secondary hover:text-white'
                )}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="page-content">
        {mode === 'camera' && (
          <div className="px-4">
            {/* 取景框 */}
            <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[3/4]">
              {photoTaken ? (
                <img 
                  src={photoTaken} 
                  alt="photo"
                  className={cn(
                    'w-full h-full object-cover transition-all',
                    filters[filterIndex].class
                  )}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-space-medium to-space-dark flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-glass flex items-center justify-center mb-4">
                    <Camera size={48} className="text-gold" />
                  </div>
                  <p className="text-text-secondary text-sm">准备拍照</p>
                  <p className="text-text-muted text-xs mt-1">点击下方按钮拍摄</p>
                </div>
              )}
              
              {/* 取景框装饰 */}
              {!photoTaken && (
                <>
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold rounded-br-lg" />
                </>
              )}

              {/* 位置标签 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-3 py-1 flex items-center gap-1">
                <Sparkles size={12} className="text-gold" />
                <span className="text-xs text-white">{selectedSpot.name}</span>
              </div>

              {/* 贴纸装饰层（示例） */}
              {showStickers && photoTaken && (
                <div className="absolute top-16 left-8 text-4xl animate-float">
                  {stickers[0]}
                </div>
              )}
            </div>

            {/* 拍照点选择 */}
            <div className="mb-4">
              <p className="text-xs text-text-secondary mb-2">选择拍照点</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {photoSpots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all',
                      selectedSpot.id === spot.id
                        ? 'bg-gold text-space-dark'
                        : 'bg-glass text-text-secondary hover:bg-glass-border'
                    )}
                  >
                    {spot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 滤镜 */}
            {photoTaken && (
              <div className="mb-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-gold mb-2 flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  滤镜效果
                </button>
                {showFilters && (
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                    {filters.map((filter, index) => (
                      <button
                        key={filter.name}
                        onClick={() => setFilterIndex(index)}
                        className={cn(
                          'flex-shrink-0 flex flex-col items-center gap-1',
                          filterIndex === index && 'text-gold'
                        )}
                      >
                        <div className={cn(
                          'w-16 h-16 rounded-lg overflow-hidden border-2',
                          filterIndex === index ? 'border-gold' : 'border-transparent'
                        )}>
                          <img 
                            src={photoTaken} 
                            alt={filter.name}
                            className={cn('w-full h-full object-cover', filter.class)}
                          />
                        </div>
                        <span className="text-xs text-text-secondary">{filter.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 贴纸 */}
            {photoTaken && (
              <div className="mb-6">
                <button 
                  onClick={() => setShowStickers(!showStickers)}
                  className="text-xs text-gold mb-2 flex items-center gap-1"
                >
                  <Sticker size={12} />
                  添加贴纸
                </button>
                {showStickers && (
                  <div className="flex gap-3 flex-wrap">
                    {stickers.map((sticker, index) => (
                      <button
                        key={index}
                        className="w-12 h-12 rounded-lg bg-glass flex items-center justify-center text-2xl hover:bg-glass-border transition-colors"
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 拍照/操作按钮 */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {photoTaken ? (
                <>
                  <button
                    onClick={handleReset}
                    className="w-14 h-14 rounded-full bg-glass flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <button
                    onClick={handleSavePhoto}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-space-dark shadow-glow-gold"
                  >
                    <Download size={28} />
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-14 h-14 rounded-full bg-glass flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleTakePhoto}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1 shadow-glow-gold"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <Camera size={28} className="text-space-dark" />
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'postcard' && (
          <div className="px-4">
            {/* 明信片预览 */}
            <div className="relative mx-auto w-full max-w-sm mb-6">
              <div 
                className="relative rounded-lg overflow-hidden shadow-2xl"
                style={{
                  padding: '12px',
                  background: `linear-gradient(135deg, ${selectedTemplate.color}40, transparent)`
                }}
              >
                <div 
                  className="border-2 rounded-lg overflow-hidden"
                  style={{ borderColor: selectedTemplate.color }}
                >
                  <img 
                    src="/images/hall-special.svg" 
                    alt="postcard"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-space-dark">
                    <p className="text-sm text-white leading-relaxed font-display italic">
                      "{postcardText}"
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.avatar} 
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-text-secondary">{user.nickname}</span>
                      </div>
                      <span className="text-xs text-gold">元宇宙博物馆</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 模板选择 */}
            <div className="mb-6">
              <p className="text-xs text-text-secondary mb-3">选择边框样式</p>
              <div className="flex gap-3">
                {postcardTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={cn(
                      'flex-shrink-0 w-16 h-20 rounded-lg flex items-center justify-center transition-all',
                      selectedTemplate.id === tpl.id
                        ? 'ring-2 ring-gold ring-offset-2 ring-offset-space-dark scale-105'
                        : ''
                    )}
                    style={{ 
                      borderWidth: 3,
                      borderStyle: 'solid',
                      borderColor: tpl.color,
                      backgroundColor: tpl.color + '20'
                    }}
                  >
                    <span className="text-[10px] text-white text-center">{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 文字编辑 */}
            <div className="mb-6">
              <p className="text-xs text-text-secondary mb-3 flex items-center gap-1">
                <Type size={12} />
                编辑寄语
              </p>
              <textarea
                value={postcardText}
                onChange={(e) => setPostcardText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none"
                placeholder="写下你的祝福..."
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mb-8">
              <button 
                onClick={handleSavePostcard}
                className="flex-1 btn-ghost flex items-center justify-center gap-2">
                <Download size={16} />
                保存
              </button>
              <button 
                onClick={() => { handleSavePostcard(); setShowShareModal(true); }}
                className="flex-1 btn-gold flex items-center justify-center gap-2"
              >
                <Send size={16} />
                分享
              </button>
            </div>
          </div>
        )}

        {mode === 'album' && (
          <div className="px-4">
            {user.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {user.photos.map((photo) => (
                  <GlassCard 
                    key={photo.id} 
                    className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => handleOpenPhotoDetail(photo)}
                  >
                    <div className="relative">
                      <img 
                        src={photo.image} 
                        alt={photo.title}
                        className="w-full h-32 object-cover"
                      />
                      {photo.type === 'postcard' && (
                        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-gold/90 text-space-dark font-medium">
                          明信片
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-white truncate">{photo.title}</p>
                      <p className="text-[10px] text-text-muted">{photo.location}</p>
                      {photo.text && (
                        <p className="text-[10px] text-text-secondary mt-1 line-clamp-1 italic">"{photo.text}"</p>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-glass flex items-center justify-center mb-4">
                  <Image size={32} className="text-text-muted" />
                </div>
                <p className="text-text-secondary mb-2">相册是空的</p>
                <p className="text-text-muted text-sm mb-4">去拍一些美照或制作明信片吧</p>
                <button
                  onClick={() => setMode('camera')}
                  className="btn-gold"
                >
                  开始拍照
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 分享弹窗 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          <GlassCard className="relative w-full max-w-md mx-4 mb-8 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">分享到</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-text-secondary hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { name: '微信', icon: '💬', color: 'bg-green-500/20 text-green-400' },
                { name: '朋友圈', icon: '🌐', color: 'bg-blue-500/20 text-blue-400' },
                { name: '微博', icon: '📢', color: 'bg-red-500/20 text-red-400' },
                { name: 'QQ', icon: '🐧', color: 'bg-sky-500/20 text-sky-400' },
                { name: '保存', icon: '💾', color: 'bg-purple-500/20 text-purple-400' },
                { name: '收藏', icon: '❤️', color: 'bg-pink-500/20 text-pink-400' },
                { name: '复制链接', icon: '🔗', color: 'bg-teal-500/20 text-teal-400' },
                { name: '更多', icon: '...', color: 'bg-gray-500/20 text-gray-400' },
              ].map((item) => (
                <button
                  key={item.name}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-xl`}>
                    {item.icon}
                  </div>
                  <span className="text-xs text-text-secondary">{item.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="btn-ghost w-full"
            >
              取消
            </button>
          </GlassCard>
        </div>
      )}

      {/* Toast 提示 */}
      {toast.show && (
        <div className={cn(
          'fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-down',
          toast.type === 'success' ? 'bg-teal text-white' : 'bg-red-500 text-white'
        )}>
          {toast.message}
        </div>
      )}

      {/* 照片/明信片详情弹窗 */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClosePhotoDetail}
          />
          <div className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClosePhotoDetail}
              className="absolute -top-12 right-0 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <GlassCard className="overflow-hidden">
              {/* 图片预览 */}
              <div
                className="relative"
                style={{
                  padding: selectedPhoto.type === 'postcard' ? '12px' : '0',
                  background: selectedPhoto.type === 'postcard'
                    ? `linear-gradient(135deg, ${selectedPhoto.templateColor}40, transparent)`
                    : 'transparent'
                }}
              >
                <div
                  style={{
                    border: selectedPhoto.type === 'postcard' ? `2px solid ${selectedPhoto.templateColor}` : 'none',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    className="w-full h-64 object-cover"
                  />
                  {selectedPhoto.type === 'postcard' && (
                    <div className="p-4 bg-space-dark">
                      {isEditing ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-xl bg-glass border border-glass-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none italic"
                          placeholder="写下你的祝福..."
                        />
                      ) : (
                        <p className="text-sm text-white leading-relaxed font-display italic">
                          "{selectedPhoto.text}"
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs text-text-secondary">{user.nickname}</span>
                        </div>
                        <span className="text-xs text-gold">元宇宙博物馆</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 信息区域 */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{selectedPhoto.title}</h3>
                  {selectedPhoto.type === 'postcard' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold font-medium">
                      明信片
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mb-2">
                  📍 {selectedPhoto.location}
                </p>
                <p className="text-xs text-text-muted">
                  📅 {formatDate(selectedPhoto.createdAt)}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="px-4 pb-4">
                <div className="flex gap-3 mb-3">
                  {selectedPhoto.type === 'postcard' && (
                    <>
                      <button
                        onClick={handleToggleEdit}
                        className={cn(
                          'flex-1 btn-ghost flex items-center justify-center gap-2',
                          isEditing && 'bg-gold/20 border-gold/50 text-gold'
                        )}
                      >
                        {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                        {isEditing ? '取消编辑' : '编辑寄语'}
                      </button>
                      {isEditing ? (
                        <button
                          onClick={handleSaveAsNew}
                          className="flex-1 btn-gold flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          另存为新
                        </button>
                      ) : (
                        <button
                          onClick={handleShareFromDetail}
                          className="flex-1 btn-gold flex items-center justify-center gap-2"
                        >
                          <Share2 size={16} />
                          分享
                        </button>
                      )}
                    </>
                  )}
                  {selectedPhoto.type !== 'postcard' && (
                    <button
                      onClick={handleShareFromDetail}
                      className="flex-1 btn-gold flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      分享
                    </button>
                  )}
                </div>
                <button
                  onClick={handleClosePhotoDetail}
                  className="btn-ghost w-full"
                >
                  关闭
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoShare;
