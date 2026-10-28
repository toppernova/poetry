/**
 * Motivation, Education and Research
 * Web Application Logic & Interactive State
 * Identical Blogger layout & fonts for Aman Kumar (B.Tech CSE, RVSCET Jamshedpur)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.BLOG_DATA) {
    console.error('Blog data could not be loaded.');
    return;
  }

  // Local Storage Keys
  const STORAGE_KEY_POSTS = 'MER_CUSTOM_POSTS';
  const STORAGE_KEY_COMMENTS = 'MER_USER_COMMENTS';
  const STORAGE_KEY_LIKES = 'MER_POST_LIKES';
  const STORAGE_KEY_PROFILE = 'MER_USER_PROFILE';
  const STORAGE_KEY_THEME = 'MER_THEME';
  const STORAGE_KEY_AUTHOR_AUTH = 'MER_AUTHOR_AUTHENTICATED';
  const STORAGE_KEY_AUTHOR_PIN = 'MER_AUTHOR_PIN';
  const DEFAULT_AUTHOR_PIN = 'aman123';

  // Author Permissions (Aman Kumar Only)
  const isAuthorAuthenticated = () => {
    return localStorage.getItem(STORAGE_KEY_AUTHOR_AUTH) === 'true';
  };

  const getAuthorPin = () => {
    return localStorage.getItem(STORAGE_KEY_AUTHOR_PIN) || DEFAULT_AUTHOR_PIN;
  };

  const setAuthorPin = (newPin) => {
    if (newPin && newPin.trim()) {
      localStorage.setItem(STORAGE_KEY_AUTHOR_PIN, newPin.trim());
    }
  };

  const loginAsAuthor = (inputPin) => {
    const correctPin = getAuthorPin();
    if (inputPin === correctPin) {
      localStorage.setItem(STORAGE_KEY_AUTHOR_AUTH, 'true');
      updateAuthorStateUI();
      return true;
    }
    return false;
  };

  const logoutAuthor = () => {
    localStorage.removeItem(STORAGE_KEY_AUTHOR_AUTH);
    updateAuthorStateUI();
  };

  // 1. Author Profile (Aman Kumar only, no mentor)
  const defaultProfile = {
    name: "Aman Kumar",
    role: "Student, Department of B.Tech CSE",
    college: "RVS College of Engineering and Technology, Jamshedpur, Jharkhand",
    bio: "Aman Kumar, student of B.Tech in Computer Science and Engineering at RVS College of Engineering and Technology, Jamshedpur, Jharkhand. Dedicated to motivate the reader, understand new concepts, and integrate them in education and research.",
    avatar: "assets/aman_avatar.jpg",
    socialLinks: {
      youtube: "https://youtube.com/@AmanKumar",
      github: "https://github.com/amankumar",
      linkedin: "https://linkedin.com/in/aman-kumar",
      instagram: "https://instagram.com/aman_kumar",
      facebook: "https://facebook.com/aman.kumar",
      whatsapp: "+91 9876543210",
      email: "amankumar.rvscet@gmail.com"
    }
  };

  const getUserProfile = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILE));
      if (!stored) return defaultProfile;
      return {
        ...defaultProfile,
        ...stored,
        socialLinks: {
          ...defaultProfile.socialLinks,
          ...(stored.socialLinks || {})
        }
      };
    } catch {
      return defaultProfile;
    }
  };

  // Social URL Formatter Helpers
  function formatWhatsAppLink(raw) {
    if (!raw) return 'https://wa.me/919876543210';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : 'https://wa.me/919876543210';
  }

  function formatEmailLink(raw) {
    if (!raw) return 'mailto:amankumar.rvscet@gmail.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('mailto:')) return trimmed;
    return `mailto:${trimmed}`;
  }

  function formatGitHubLink(raw) {
    if (!raw) return 'https://github.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const cleanUser = trimmed.replace(/^@/, '');
    return `https://github.com/${cleanUser}`;
  }

  function formatYouTubeLink(raw) {
    if (!raw) return 'https://youtube.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('@')) return `https://youtube.com/${trimmed}`;
    return `https://${trimmed}`;
  }

  function formatLinkedInLink(raw) {
    if (!raw) return 'https://linkedin.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('in/')) return `https://linkedin.com/${trimmed}`;
    return `https://linkedin.com/in/${trimmed.replace(/^@/, '')}`;
  }

  function formatInstagramLink(raw) {
    if (!raw) return 'https://instagram.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const cleanUser = trimmed.replace(/^@/, '');
    return `https://instagram.com/${cleanUser}`;
  }

  function formatFacebookLink(raw) {
    if (!raw) return 'https://facebook.com';
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://facebook.com/${trimmed.replace(/^@/, '')}`;
  }

  const saveUserProfile = (newProfile) => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    updateProfileUI();
  };

  // 2. Custom Uploaded Posts
  const getCustomPosts = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS)) || [];
    } catch {
      return [];
    }
  };

  const saveCustomPosts = (posts) => {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  };

  // 3. Comments Storage
  const getStoredComments = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_COMMENTS)) || {};
    } catch {
      return {};
    }
  };

  const saveStoredComment = (postId, commentObj) => {
    const stored = getStoredComments();
    if (!stored[postId]) {
      stored[postId] = [];
    }
    stored[postId].push(commentObj);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(stored));
  };

  // 4. Likes Storage
  const getStoredLikes = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_LIKES)) || { likedPostIds: [], counts: {} };
    } catch {
      return { likedPostIds: [], counts: {} };
    }
  };

  const togglePostLike = (postId) => {
    const data = getStoredLikes();
    const isLiked = data.likedPostIds.includes(postId);
    
    if (isLiked) {
      data.likedPostIds = data.likedPostIds.filter(id => id !== postId);
      data.counts[postId] = Math.max(0, (data.counts[postId] || 1) - 1);
    } else {
      data.likedPostIds.push(postId);
      data.counts[postId] = (data.counts[postId] || 0) + 1;
    }

    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(data));
    return {
      isLiked: !isLiked,
      count: data.counts[postId]
    };
  };

  // Combine bundled posts + user uploaded posts
  const getAllPosts = () => {
    const bundled = window.BLOG_DATA.posts || [];
    const custom = getCustomPosts();
    const featured = bundled.filter(p => p.isFeatured);
    const nonFeatured = bundled.filter(p => !p.isFeatured);
    return [...featured, ...custom, ...nonFeatured];
  };

  // State
  let currentFilter = { type: 'all', value: '' };
  const POSTS_PER_PAGE = 6;
  let visiblePostsLimit = POSTS_PER_PAGE;
  let isArchiveExpanded = false;
  let activeModalPostId = null;
  let stagedImageBase64 = '';

  // Elements
  const topBar = document.getElementById('centered-top-bar');
  const drawer = document.getElementById('sidebar-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerHamburger = document.getElementById('drawer-hamburger');
  const drawerClose = document.getElementById('drawer-close');

  const openCreatorBtn = document.getElementById('open-creator-btn');
  const searchWrapper = document.getElementById('search-wrapper');
  const blogSearchInput = document.getElementById('blog-search-input');
  const searchIconBtn = document.getElementById('search-icon-btn');
  const themeBtn = document.getElementById('theme-btn');

  const tabHomeLink = document.getElementById('tab-home-link');
  const tabProfileLink = document.getElementById('tab-profile-link');
  const tabArchiveLink = document.getElementById('tab-archive-link');

  const filterBar = document.getElementById('filter-bar');
  const filterText = document.getElementById('filter-text');
  const filterClearBtn = document.getElementById('filter-clear-btn');

  const featuredPostBox = document.getElementById('featured-post-box');
  const postsStream = document.getElementById('posts-stream');
  const pagerBox = document.getElementById('pager-box');
  const loadMorePosts = document.getElementById('load-more-posts');

  const archiveItemsList = document.getElementById('archive-items-list');
  const archiveToggleBtn = document.getElementById('archive-toggle-btn');
  const editProfileTrigger = document.getElementById('edit-profile-trigger');

  // Reader Modal Elements
  const readingModal = document.getElementById('reading-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPostTitle = document.getElementById('modal-post-title');
  const modalPostDate = document.getElementById('modal-post-date');
  const modalPostAuthor = document.getElementById('modal-post-author');
  const modalCategory = document.getElementById('modal-category');
  const modalPostCommentsCount = document.getElementById('modal-post-comments-count');
  const modalPostContent = document.getElementById('modal-post-content');
  const modalActions = document.getElementById('modal-actions');
  const modalEditBtn = document.getElementById('modal-edit-btn');
  const modalDeleteBtn = document.getElementById('modal-delete-btn');
  const modalLikeTrigger = document.getElementById('modal-like-trigger');
  const modalLikeCount = document.getElementById('modal-like-count');
  const modalShareTrigger = document.getElementById('modal-share-trigger');
  const modalShareDropdown = document.getElementById('modal-share-dropdown');
  const modalCommentsCountBadge = document.getElementById('modal-comments-count-badge');
  const modalCommentsEntries = document.getElementById('modal-comments-entries');
  const commentSubmissionForm = document.getElementById('comment-submission-form');
  const newCommentAuthor = document.getElementById('new-comment-author');
  const newCommentContent = document.getElementById('new-comment-content');

  // Creator Modal Elements
  const creatorModal = document.getElementById('creator-modal');
  const creatorModalClose = document.getElementById('creator-modal-close');
  const creatorModalCancel = document.getElementById('creator-modal-cancel');
  const creatorModalForm = document.getElementById('creator-modal-form');
  const editTargetId = document.getElementById('edit-target-id');
  const newPostTitle = document.getElementById('new-post-title');
  const newPostCategory = document.getElementById('new-post-category');
  const newPostAuthor = document.getElementById('new-post-author');
  const postFileUploader = document.getElementById('post-file-uploader');
  const postImageUrlInput = document.getElementById('post-image-url-input');
  const creatorImgPreviewBox = document.getElementById('creator-img-preview-box');
  const creatorImgPreview = document.getElementById('creator-img-preview');
  const creatorImgRemove = document.getElementById('creator-img-remove');
  const newPostBody = document.getElementById('new-post-body');
  const creatorSubmitBtn = document.getElementById('creator-submit-btn');

  // Profile Edit Modal Elements
  const profileEditModal = document.getElementById('profile-edit-modal');
  const profileEditClose = document.getElementById('profile-edit-close');
  const profileEditCancel = document.getElementById('profile-edit-cancel');
  const profileEditForm = document.getElementById('profile-edit-form');
  const profileModalAvatarPreview = document.getElementById('profile-modal-avatar-preview');
  const profileAvatarUpload = document.getElementById('profile-avatar-upload');
  const editProfileName = document.getElementById('edit-profile-name');
  const editProfileRole = document.getElementById('edit-profile-role');
  const editProfileCollege = document.getElementById('edit-profile-college');
  const editProfileBio = document.getElementById('edit-profile-bio');
  const editProfileYoutube = document.getElementById('edit-profile-youtube');
  const editProfileGithub = document.getElementById('edit-profile-github');
  const editProfileLinkedin = document.getElementById('edit-profile-linkedin');
  const editProfileInstagram = document.getElementById('edit-profile-instagram');
  const editProfileFacebook = document.getElementById('edit-profile-facebook');
  const editProfileWhatsapp = document.getElementById('edit-profile-whatsapp');
  const editProfileEmail = document.getElementById('edit-profile-email');
  const editLinksTrigger = document.getElementById('edit-links-trigger');
  const tabLinksLink = document.getElementById('tab-links-link');

  // Toast & Scroll to top
  const toastBar = document.getElementById('toast-bar');
  const toastMessage = document.getElementById('toast-message');
  const scrollToTop = document.getElementById('scroll-to-top');

  // Toast Helper
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastBar.classList.add('show');
    setTimeout(() => {
      toastBar.classList.remove('show');
    }, 2800);
  }

  // Theme Management
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  themeBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    }
  });

  // Sticky Bar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      topBar.classList.add('sticky');
      scrollToTop.classList.add('visible');
    } else {
      topBar.classList.remove('sticky');
      scrollToTop.classList.remove('visible');
    }
  });

  scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Update Profile & Links across all UI sections (Aman Kumar only)
  function updateProfileUI() {
    const profile = getUserProfile();
    const links = profile.socialLinks || defaultProfile.socialLinks;

    // 1. Sidebar Profile Widget (About Me)
    const sideImg = document.getElementById('sidebar-profile-img');
    if (sideImg) sideImg.src = profile.avatar;
    const sideName = document.getElementById('sidebar-profile-name');
    if (sideName) sideName.textContent = profile.name;
    const sideRole = document.getElementById('sidebar-profile-role');
    if (sideRole) sideRole.textContent = profile.role;
    const sideCollege = document.querySelector('.profile-college');
    if (sideCollege) sideCollege.textContent = profile.college || defaultProfile.college;
    const sideBio = document.getElementById('sidebar-profile-bio');
    if (sideBio) sideBio.textContent = profile.bio;

    // Formatted Link URLs
    const ytUrl = formatYouTubeLink(links.youtube);
    const ghUrl = formatGitHubLink(links.github);
    const liUrl = formatLinkedInLink(links.linkedin);
    const igUrl = formatInstagramLink(links.instagram);
    const fbUrl = formatFacebookLink(links.facebook);
    const waUrl = formatWhatsAppLink(links.whatsapp);
    const gmUrl = formatEmailLink(links.email);

    // 2. Header Hero Bar
    const heroYt = document.getElementById('hero-link-youtube');
    if (heroYt) heroYt.href = ytUrl;
    const heroGh = document.getElementById('hero-link-github');
    if (heroGh) heroGh.href = ghUrl;
    const heroLi = document.getElementById('hero-link-linkedin');
    if (heroLi) heroLi.href = liUrl;
    const heroIg = document.getElementById('hero-link-instagram');
    if (heroIg) heroIg.href = igUrl;
    const heroFb = document.getElementById('hero-link-facebook');
    if (heroFb) heroFb.href = fbUrl;
    const heroWa = document.getElementById('hero-link-whatsapp');
    if (heroWa) heroWa.href = waUrl;
    const heroGm = document.getElementById('hero-link-gmail');
    if (heroGm) heroGm.href = gmUrl;

    // 3. Sidebar Profile Social Buttons
    const sideYt = document.getElementById('sidebar-link-youtube');
    if (sideYt) sideYt.href = ytUrl;
    const sideGh = document.getElementById('sidebar-link-github');
    if (sideGh) sideGh.href = ghUrl;
    const sideLi = document.getElementById('sidebar-link-linkedin');
    if (sideLi) sideLi.href = liUrl;
    const sideIg = document.getElementById('sidebar-link-instagram');
    if (sideIg) sideIg.href = igUrl;
    const sideFb = document.getElementById('sidebar-link-facebook');
    if (sideFb) sideFb.href = fbUrl;
    const sideWa = document.getElementById('sidebar-link-whatsapp');
    if (sideWa) sideWa.href = waUrl;
    const sideGm = document.getElementById('sidebar-link-gmail');
    if (sideGm) sideGm.href = gmUrl;

    // 4. Footer Attribution Links
    const footYt = document.getElementById('footer-link-youtube');
    if (footYt) footYt.href = ytUrl;
    const footGh = document.getElementById('footer-link-github');
    if (footGh) footGh.href = ghUrl;
    const footLi = document.getElementById('footer-link-linkedin');
    if (footLi) footLi.href = liUrl;
    const footIg = document.getElementById('footer-link-instagram');
    if (footIg) footIg.href = igUrl;
    const footFb = document.getElementById('footer-link-facebook');
    if (footFb) footFb.href = fbUrl;
    const footWa = document.getElementById('footer-link-whatsapp');
    if (footWa) footWa.href = waUrl;
    const footGm = document.getElementById('footer-link-gmail');
    if (footGm) footGm.href = gmUrl;

    // 5. Dedicated Links Section Widget in Sidebar (LinkList)
    const linkListContainer = document.getElementById('link-list-entries');
    if (linkListContainer) {
      const ytHandle = (links.youtube || '').replace(/^https?:\/\/(www\.)?youtube\.com\/?/, '') || '@AmanKumar';
      const ghHandle = (links.github || '').replace(/^https?:\/\/(www\.)?github\.com\/?/, '') || 'amankumar';
      const liHandle = (links.linkedin || '').replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, '') || 'aman-kumar';
      const igHandle = (links.instagram || '').replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/^@/, '') || 'aman_kumar';
      const fbHandle = (links.facebook || '').replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '') || 'aman.kumar';
      const waDisplay = links.whatsapp || '+91 9876543210';
      const gmDisplay = (links.email || 'amankumar.rvscet@gmail.com').replace(/^mailto:/, '');

      linkListContainer.innerHTML = `
        <a href="${ytUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Open YouTube Channel">
          <div class="link-entry-left">
            <div class="link-entry-icon yt">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">YouTube Channel</span>
              <span class="link-entry-handle">${ytHandle}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${ghUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Open GitHub Profile">
          <div class="link-entry-left">
            <div class="link-entry-icon gh">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">GitHub Profile</span>
              <span class="link-entry-handle">${ghHandle}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${liUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Open LinkedIn Profile">
          <div class="link-entry-left">
            <div class="link-entry-icon li">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0-.01-3.38 1.69 1.69 0 0 0 .01 3.38zM7.86 18.5V10.13H5.07v8.37h2.79z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">LinkedIn Profile</span>
              <span class="link-entry-handle">${liHandle}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${igUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Open Instagram Profile">
          <div class="link-entry-left">
            <div class="link-entry-icon ig">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">Instagram Profile</span>
              <span class="link-entry-handle">@${igHandle}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${fbUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Open Facebook Profile">
          <div class="link-entry-left">
            <div class="link-entry-icon fb">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">Facebook Profile</span>
              <span class="link-entry-handle">${fbHandle}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${waUrl}" target="_blank" rel="noopener" class="link-entry-card" title="Chat on WhatsApp">
          <div class="link-entry-left">
            <div class="link-entry-icon wa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.06 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.18-.46-.3z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">WhatsApp Chat</span>
              <span class="link-entry-handle">${waDisplay}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>

        <a href="${gmUrl}" class="link-entry-card" title="Send Email">
          <div class="link-entry-left">
            <div class="link-entry-icon gm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div class="link-entry-meta">
              <span class="link-entry-title">Gmail Contact</span>
              <span class="link-entry-handle">${gmDisplay}</span>
            </div>
          </div>
          <span class="link-entry-arrow">↗</span>
        </a>
      `;
    }

    if (newPostAuthor) newPostAuthor.value = profile.name;
  }

  // Drawer Toggles
  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  drawerHamburger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Search Logic
  searchIconBtn.addEventListener('click', () => {
    const isActive = searchWrapper.classList.toggle('active');
    if (isActive) {
      blogSearchInput.focus();
    } else if (blogSearchInput.value.trim()) {
      executeSearch(blogSearchInput.value.trim());
    }
  });

  blogSearchInput.addEventListener('input', (e) => {
    executeSearch(e.target.value.trim());
  });

  function executeSearch(query) {
    if (query) {
      currentFilter = { type: 'search', value: query };
      filterBar.style.display = 'flex';
      filterText.textContent = `Search results for: "${query}"`;
    } else {
      currentFilter = { type: 'all', value: '' };
      filterBar.style.display = 'none';
    }
    visiblePostsLimit = POSTS_PER_PAGE;
    renderPostsStream();
  }

  filterClearBtn.addEventListener('click', () => {
    currentFilter = { type: 'all', value: '' };
    blogSearchInput.value = '';
    searchWrapper.classList.remove('active');
    filterBar.style.display = 'none';
    visiblePostsLimit = POSTS_PER_PAGE;
    renderPostsStream();
    window.scrollTo({ top: 250, behavior: 'smooth' });
  });

  // Tab Links
  tabHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentFilter = { type: 'all', value: '' };
    filterBar.style.display = 'none';
    visiblePostsLimit = POSTS_PER_PAGE;
    renderPostsStream();
  });

  tabProfileLink.addEventListener('click', () => {
    openDrawer();
  });

  tabArchiveLink.addEventListener('click', () => {
    openDrawer();
    const archiveBox = document.getElementById('archive-widget');
    if (archiveBox) archiveBox.scrollIntoView({ behavior: 'smooth' });
  });

  // Post Creator Modal Handlers
  function openPostCreator(postToEdit = null) {
    if (!isAuthorAuthenticated()) {
      openAuthorAuthModal(() => openPostCreator(postToEdit));
      return;
    }

    if (postToEdit) {
      editTargetId.value = postToEdit.id;
      newPostTitle.value = postToEdit.title;
      newPostCategory.value = postToEdit.category || 'Motivation';
      newPostAuthor.value = postToEdit.author;
      newPostBody.value = postToEdit.rawContent || postToEdit.contentHtml.replace(/<[^>]+>/g, '\n').trim();
      creatorSubmitBtn.textContent = 'Save Changes';
      
      if (postToEdit.thumbnail) {
        creatorImgPreview.src = postToEdit.thumbnail;
        creatorImgPreviewBox.style.display = 'block';
        stagedImageBase64 = postToEdit.thumbnail;
      }
    } else {
      creatorModalForm.reset();
      editTargetId.value = '';
      const profile = getUserProfile();
      newPostAuthor.value = profile.name;
      creatorImgPreviewBox.style.display = 'none';
      creatorImgPreview.src = '';
      stagedImageBase64 = '';
      creatorSubmitBtn.textContent = 'Publish Post';
    }

    creatorModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePostCreator() {
    creatorModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openCreatorBtn.addEventListener('click', () => {
    closeDrawer();
    openPostCreator();
  });

  creatorModalClose.addEventListener('click', closePostCreator);
  creatorModalCancel.addEventListener('click', closePostCreator);

  // Image Upload in Creator
  postFileUploader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        stagedImageBase64 = event.target.result;
        creatorImgPreview.src = stagedImageBase64;
        creatorImgPreviewBox.style.display = 'block';
        postImageUrlInput.value = '';
      };
      reader.readAsDataURL(file);
    }
  });

  postImageUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      stagedImageBase64 = url;
      creatorImgPreview.src = url;
      creatorImgPreviewBox.style.display = 'block';
    }
  });

  creatorImgRemove.addEventListener('click', () => {
    stagedImageBase64 = '';
    creatorImgPreview.src = '';
    creatorImgPreviewBox.style.display = 'none';
    postFileUploader.value = '';
    postImageUrlInput.value = '';
  });

  // Creator Form Submit
  creatorModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAuthorAuthenticated()) {
      showToast('Unauthorized: Only Author Aman Kumar can upload posts.');
      closePostCreator();
      return;
    }

    const title = newPostTitle.value.trim();
    const category = newPostCategory.value;
    const author = newPostAuthor.value.trim() || 'Aman Kumar';
    const rawContent = newPostBody.value.trim();
    const editId = editTargetId.value;

    if (!title || !rawContent) {
      alert('Please provide title and content.');
      return;
    }

    // Convert newlines to paragraphs
    const paragraphs = rawContent.split(/\n\s*\n/).map(p => {
      let trimmed = p.trim();
      if (!trimmed.startsWith('<h') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<ol')) {
        trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        trimmed = trimmed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
      }
      return trimmed;
    }).join('\n');

    const cleanText = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const snippet = cleanText.slice(0, 260) + (cleanText.length > 260 ? '...' : '');

    const now = new Date();
    const monthYear = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const dateFormatted = now.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const customPosts = getCustomPosts();

    if (editId) {
      const idx = customPosts.findIndex(p => p.id === editId);
      if (idx !== -1) {
        customPosts[idx] = {
          ...customPosts[idx],
          title,
          category,
          author,
          rawContent,
          contentHtml: paragraphs,
          snippet,
          thumbnail: stagedImageBase64 || customPosts[idx].thumbnail,
          localThumbnail: stagedImageBase64 || customPosts[idx].localThumbnail
        };
        saveCustomPosts(customPosts);
        showToast('Post updated successfully!');
      }
    } else {
      const newPost = {
        id: `custom-post-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        published: now.toISOString(),
        dateFormatted,
        monthYear,
        year: String(now.getFullYear()),
        author,
        category,
        contentHtml: paragraphs,
        rawContent,
        snippet,
        thumbnail: stagedImageBase64,
        localThumbnail: stagedImageBase64,
        origUrl: '',
        isFeatured: false,
        isUserCreated: true,
        comments: [],
        commentsCount: 0
      };

      customPosts.unshift(newPost);
      saveCustomPosts(customPosts);
      showToast('Post published successfully!');
    }

    closePostCreator();
    renderPostsStream();
    renderArchiveList();

    setTimeout(() => {
      const firstCard = document.querySelector('.post-outer');
      if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  });

  // Profile Editor Modal Handlers
  editProfileTrigger.addEventListener('click', () => {
    const profile = getUserProfile();
    editProfileName.value = profile.name;
    editProfileRole.value = profile.role;
    editProfileCollege.value = profile.college;
    editProfileBio.value = profile.bio;
    profileModalAvatarPreview.src = profile.avatar;
    
    closeDrawer();
    profileEditModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  profileEditClose.addEventListener('click', () => {
    profileEditModal.classList.remove('open');
    document.body.style.overflow = '';
  });

  profileEditCancel.addEventListener('click', () => {
    profileEditModal.classList.remove('open');
    document.body.style.overflow = '';
  });

  profileAvatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profileModalAvatarPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  profileEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      name: editProfileName.value.trim(),
      role: editProfileRole.value.trim(),
      college: editProfileCollege.value.trim(),
      bio: editProfileBio.value.trim(),
      avatar: profileModalAvatarPreview.src
    };
    saveUserProfile(updated);
    profileEditModal.classList.remove('open');
    document.body.style.overflow = '';
    showToast('Profile updated!');
  });

  // Render Featured Couplet (Exact blockquote style)
  function renderFeaturedPost() {
    const allPosts = getAllPosts();
    const featured = allPosts.find(p => p.isFeatured) || allPosts[0];
    if (!featured) return;

    const extraComments = getStoredComments()[featured.id] || [];
    const totalComments = (featured.comments ? featured.comments.length : 0) + extraComments.length;

    featuredPostBox.innerHTML = `
      <div class="post-header-line-1">
        <span class="post-timestamp">${featured.dateFormatted}</span>
      </div>
      <blockquote>
        Hum bhi dariya hain, humein apna hunar maloom hai;<br>
        Jis traf bhi chal padenge, rasta ho jayegi.
      </blockquote>
      <div class="post-bottom">
        <div class="post-bottom-left">
          <a class="comment-link open-article-trigger" data-id="${featured.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <span>${totalComments > 0 ? `${totalComments} Comments` : 'Post a Comment'}</span>
          </a>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="share-wrapper">
            <button class="pill-button post-share-btn" data-id="${featured.id}" data-url="${featured.origUrl || window.location.href}" data-title="${featured.title}">Share</button>
            <div class="share-menu-dropdown" id="share-menu-${featured.id}">
              <button class="share-menu-item" onclick="sharePost('copy', '${featured.title}', '${featured.origUrl}')">📋 Copy link</button>
              <button class="share-menu-item" onclick="sharePost('whatsapp', '${featured.title}', '${featured.origUrl}')">💬 WhatsApp</button>
              <button class="share-menu-item" onclick="sharePost('facebook', '${featured.title}', '${featured.origUrl}')">📘 Facebook</button>
              <button class="share-menu-item" onclick="sharePost('twitter', '${featured.title}', '${featured.origUrl}')">🐦 X (Twitter)</button>
              <button class="share-menu-item" onclick="sharePost('email', '${featured.title}', '${featured.origUrl}')">✉️ Email</button>
            </div>
          </div>

          <a class="flat-button open-article-trigger" data-id="${featured.id}">Read more</a>
        </div>
      </div>
    `;
  }

  // Render Posts Stream
  function renderPostsStream() {
    const all = getAllPosts();
    let filtered = [...all];

    if (currentFilter.type === 'all') {
      filtered = filtered.filter(p => !p.isFeatured);
    } else if (currentFilter.type === 'search') {
      const q = currentFilter.value.toLowerCase();
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.snippet && p.snippet.toLowerCase().includes(q)) || 
        (p.contentHtml && p.contentHtml.toLowerCase().includes(q))
      );
    } else if (currentFilter.type === 'archive') {
      filtered = filtered.filter(p => p.monthYear === currentFilter.value);
    }

    if (filtered.length === 0) {
      postsStream.innerHTML = `
        <div class="post-outer" style="text-align: center; padding: 40px 20px;">
          <h3 style="color: var(--text-muted); font-size: 18px; margin-bottom: 8px;">No posts found.</h3>
          <p style="color: var(--text-body); margin-bottom: 16px;">Try another search term or write a new article!</p>
          <button class="pill-button-filled" onclick="document.getElementById('open-creator-btn').click()">New Post</button>
        </div>
      `;
      pagerBox.style.display = 'none';
      return;
    }

    const postsToDisplay = filtered.slice(0, visiblePostsLimit);
    const likesData = getStoredLikes();

    postsStream.innerHTML = postsToDisplay.map(post => {
      const extraComments = getStoredComments()[post.id] || [];
      const totalComments = (post.comments ? post.comments.length : 0) + extraComments.length;
      const thumb = post.localThumbnail || post.thumbnail;
      const isLiked = likesData.likedPostIds.includes(post.id);
      const likeCount = likesData.counts[post.id] || 0;

      return `
        <article class="post-outer" id="card-${post.id}">
          <h2 class="post-title">
            <a class="open-article-trigger" data-id="${post.id}">${post.title}</a>
          </h2>

          <div class="post-header-line-1">
            <span class="post-timestamp">${post.dateFormatted}</span>
          </div>

          <div class="post-body-container">
            ${thumb ? `
              <div class="post-thumb-box open-article-trigger" data-id="${post.id}">
                <img src="${thumb}" alt="${post.title}" loading="lazy">
              </div>
            ` : ''}
            <div class="post-snippet-text">
              ${post.snippet}
            </div>
          </div>

          <div class="post-bottom">
            <div class="post-bottom-left">
              <!-- Comment Count Link -->
              <a class="comment-link open-article-trigger" data-id="${post.id}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                </svg>
                <span>${totalComments > 0 ? `${totalComments} Comments` : 'Post a Comment'}</span>
              </a>

              <!-- Like Button -->
              <button class="like-trigger-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>${likeCount > 0 ? likeCount : 'Like'}</span>
              </button>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="share-wrapper">
                <button class="pill-button post-share-btn" data-id="${post.id}" data-url="${post.origUrl || window.location.href}" data-title="${post.title}">Share</button>
                <div class="share-menu-dropdown" id="share-menu-${post.id}">
                  <button class="share-menu-item" onclick="sharePost('copy', '${post.title}', '${post.origUrl}')">📋 Copy link</button>
                  <button class="share-menu-item" onclick="sharePost('whatsapp', '${post.title}', '${post.origUrl}')">💬 WhatsApp</button>
                  <button class="share-menu-item" onclick="sharePost('facebook', '${post.title}', '${post.origUrl}')">📘 Facebook</button>
                  <button class="share-menu-item" onclick="sharePost('twitter', '${post.title}', '${post.origUrl}')">🐦 X (Twitter)</button>
                  <button class="share-menu-item" onclick="sharePost('email', '${post.title}', '${post.origUrl}')">✉️ Email</button>
                </div>
              </div>

              <a class="flat-button open-article-trigger" data-id="${post.id}">Read more</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (visiblePostsLimit >= filtered.length) {
      pagerBox.style.display = 'none';
    } else {
      pagerBox.style.display = 'block';
    }

    attachListeners();
  }

  loadMorePosts.addEventListener('click', () => {
    visiblePostsLimit += POSTS_PER_PAGE;
    renderPostsStream();
  });

  // Render Archive List (All 16 Months)
  function renderArchiveList() {
    const allPosts = getAllPosts();
    const dynamicArchives = {};

    allPosts.forEach(p => {
      if (p.monthYear) {
        dynamicArchives[p.monthYear] = (dynamicArchives[p.monthYear] || 0) + 1;
      }
    });

    const archiveKeys = Object.keys(dynamicArchives);
    const visibleKeys = isArchiveExpanded ? archiveKeys : archiveKeys.slice(0, 7);

    archiveItemsList.innerHTML = visibleKeys.map(month => `
      <li>
        <a href="#" class="archive-month-link ${currentFilter.type === 'archive' && currentFilter.value === month ? 'active' : ''}" data-month="${month}">
          <span>${month}</span>
          <span class="post-count">${dynamicArchives[month]}</span>
        </a>
      </li>
    `).join('');

    archiveItemsList.querySelectorAll('.archive-month-link').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const month = item.getAttribute('data-month');
        currentFilter = { type: 'archive', value: month };
        filterBar.style.display = 'flex';
        filterText.textContent = `Showing posts from: ${month}`;
        visiblePostsLimit = POSTS_PER_PAGE;
        closeDrawer();
        renderPostsStream();
        window.scrollTo({ top: 380, behavior: 'smooth' });
      });
    });

    if (archiveKeys.length > 7) {
      archiveToggleBtn.style.display = 'block';
      archiveToggleBtn.textContent = isArchiveExpanded ? 'Show less' : 'Show more';
    } else {
      archiveToggleBtn.style.display = 'none';
    }
  }

  archiveToggleBtn.addEventListener('click', () => {
    isArchiveExpanded = !isArchiveExpanded;
    renderArchiveList();
  });

  // Open Full Article Modal
  function openArticleModal(postId) {
    const allPosts = getAllPosts();
    const post = allPosts.find(p => p.id === postId || p.id === String(postId));
    if (!post) return;

    activeModalPostId = post.id;
    modalPostTitle.textContent = post.title;
    modalPostDate.textContent = post.dateFormatted;
    modalPostAuthor.textContent = post.author || 'Aman Kumar';
    modalCategory.textContent = post.category || 'Motivation';

    // Show Edit/Delete ONLY if post is custom uploaded AND author is authenticated
    if (post.isUserCreated && isAuthorAuthenticated()) {
      modalActions.style.display = 'flex';
      modalEditBtn.onclick = () => {
        closeArticleModal();
        openPostCreator(post);
      };
      modalDeleteBtn.onclick = () => {
        if (confirm(`Delete "${post.title}"?`)) {
          const custom = getCustomPosts().filter(p => p.id !== post.id);
          saveCustomPosts(custom);
          closeArticleModal();
          renderPostsStream();
          renderArchiveList();
          showToast('Post deleted.');
        }
      };
    } else {
      modalActions.style.display = 'none';
    }

    modalPostContent.innerHTML = post.contentHtml;

    // Like count in modal
    const likesData = getStoredLikes();
    const isLiked = likesData.likedPostIds.includes(post.id);
    const count = likesData.counts[post.id] || 0;

    modalLikeTrigger.className = `like-trigger-btn ${isLiked ? 'liked' : ''}`;
    modalLikeCount.textContent = `${count} Like${count !== 1 ? 's' : ''}`;

    modalLikeTrigger.onclick = () => {
      const res = togglePostLike(post.id);
      modalLikeTrigger.className = `like-trigger-btn ${res.isLiked ? 'liked' : ''}`;
      modalLikeCount.textContent = `${res.count} Like${res.count !== 1 ? 's' : ''}`;
      renderPostsStream();
    };

    renderModalComments(post);

    readingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    readingModal.classList.remove('open');
    document.body.style.overflow = '';
    modalShareDropdown.classList.remove('open');
  }

  modalCloseBtn.addEventListener('click', closeArticleModal);
  readingModal.addEventListener('click', (e) => {
    if (e.target === readingModal) closeArticleModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (readingModal.classList.contains('open')) closeArticleModal();
      if (creatorModal.classList.contains('open')) closePostCreator();
      if (profileEditModal.classList.contains('open')) profileEditModal.classList.remove('open');
      if (authorAuthModal && authorAuthModal.classList.contains('open')) closeAuthorAuthModal();
    }
  });

  // Render Comments in Modal
  function renderModalComments(post) {
    const existing = post.comments || [];
    const userComments = getStoredComments()[post.id] || [];
    const allComments = [...existing, ...userComments];

    modalCommentsCountBadge.textContent = allComments.length;
    modalPostCommentsCount.textContent = `${allComments.length} comment${allComments.length !== 1 ? 's' : ''}`;

    if (allComments.length === 0) {
      modalCommentsEntries.innerHTML = `
        <p style="color: var(--text-muted); font-size: 14px; font-style: italic;">
          No comments yet. Post the first comment!
        </p>
      `;
      return;
    }

    modalCommentsEntries.innerHTML = allComments.map(c => `
      <div class="comment-entry">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="comment-author-name">${c.author}</span>
          <span style="font-size: 12px; color: var(--text-muted); font-style: italic;">${c.date ? c.date.slice(0, 10) : 'Recently'}</span>
        </div>
        <div class="comment-text">${c.content}</div>
      </div>
    `).join('');
  }

  // Comment Submission
  commentSubmissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeModalPostId) return;

    const author = newCommentAuthor.value.trim() || 'Anonymous';
    const content = newCommentContent.value.trim();

    if (!content) return;

    saveStoredComment(activeModalPostId, {
      author,
      content,
      date: new Date().toISOString()
    });

    newCommentContent.value = '';
    
    const allPosts = getAllPosts();
    const post = allPosts.find(p => p.id === activeModalPostId);
    if (post) renderModalComments(post);

    showToast('Comment published!');
    renderPostsStream();
  });

  // Share Handler
  window.sharePost = function(platform, title, url) {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link copied to clipboard!');
      }).catch(() => {
        showToast('Link copied!');
      });
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`;
    }

    document.querySelectorAll('.share-menu-dropdown').forEach(m => m.classList.remove('open'));
  };

  modalShareTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    modalShareDropdown.classList.toggle('open');
  });

  // Attach card event listeners
  function attachListeners() {
    document.querySelectorAll('.open-article-trigger').forEach(elem => {
      elem.addEventListener('click', () => {
        const id = elem.getAttribute('data-id');
        openArticleModal(id);
      });
    });

    document.querySelectorAll('.like-trigger-btn[data-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const res = togglePostLike(id);
        
        btn.classList.toggle('liked', res.isLiked);
        btn.querySelector('span').textContent = res.count > 0 ? res.count : 'Like';
      });
    });

    document.querySelectorAll('.post-share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const menu = document.getElementById(`share-menu-${id}`);
        const isOpen = menu.classList.contains('open');

        document.querySelectorAll('.share-menu-dropdown').forEach(m => m.classList.remove('open'));
        if (!isOpen) menu.classList.add('open');
      });
    });
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.share-menu-dropdown').forEach(m => m.classList.remove('open'));
  });

  // Profile & Social Links Management
  let stagedAvatarBase64 = '';

  function openProfileModal(focusLinks = false) {
    if (!isAuthorAuthenticated()) {
      openAuthorAuthModal(() => openProfileModal(focusLinks));
      return;
    }

    const profile = getUserProfile();
    const links = profile.socialLinks || defaultProfile.socialLinks;

    if (editProfileName) editProfileName.value = profile.name || '';
    if (editProfileRole) editProfileRole.value = profile.role || '';
    if (editProfileCollege) editProfileCollege.value = profile.college || '';
    if (editProfileBio) editProfileBio.value = profile.bio || '';
    if (profileModalAvatarPreview) profileModalAvatarPreview.src = profile.avatar || defaultProfile.avatar;
    stagedAvatarBase64 = profile.avatar || '';

    if (editProfileYoutube) editProfileYoutube.value = links.youtube || '';
    if (editProfileGithub) editProfileGithub.value = links.github || '';
    if (editProfileLinkedin) editProfileLinkedin.value = links.linkedin || '';
    if (editProfileInstagram) editProfileInstagram.value = links.instagram || '';
    if (editProfileFacebook) editProfileFacebook.value = links.facebook || '';
    if (editProfileWhatsapp) editProfileWhatsapp.value = links.whatsapp || '';
    if (editProfileEmail) editProfileEmail.value = links.email || '';

    const editAuthorPin = document.getElementById('edit-author-pin');
    if (editAuthorPin) editAuthorPin.value = '';

    profileEditModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (focusLinks && editProfileYoutube) {
      setTimeout(() => {
        editProfileYoutube.focus();
        editProfileYoutube.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }

  function closeProfileModal() {
    profileEditModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (editProfileTrigger) {
    editProfileTrigger.addEventListener('click', () => openProfileModal(false));
  }
  if (editLinksTrigger) {
    editLinksTrigger.addEventListener('click', () => openProfileModal(true));
  }
  if (profileEditClose) {
    profileEditClose.addEventListener('click', closeProfileModal);
  }
  if (profileEditCancel) {
    profileEditCancel.addEventListener('click', closeProfileModal);
  }
  if (profileEditModal) {
    profileEditModal.addEventListener('click', (e) => {
      if (e.target === profileEditModal) closeProfileModal();
    });
  }

  // Profile Avatar Upload Preview
  if (profileAvatarUpload) {
    profileAvatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          stagedAvatarBase64 = evt.target.result;
          if (profileModalAvatarPreview) profileModalAvatarPreview.src = stagedAvatarBase64;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Profile & Social Links Form Submission
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isAuthorAuthenticated()) {
        showToast('Unauthorized: Only Author Aman Kumar can edit settings.');
        closeProfileModal();
        return;
      }

      const current = getUserProfile();

      const updated = {
        name: editProfileName.value.trim() || current.name,
        role: editProfileRole.value.trim() || current.role,
        college: editProfileCollege.value.trim() || current.college,
        bio: editProfileBio.value.trim() || current.bio,
        avatar: stagedAvatarBase64 || current.avatar,
        socialLinks: {
          youtube: editProfileYoutube ? (editProfileYoutube.value.trim() || defaultProfile.socialLinks.youtube) : defaultProfile.socialLinks.youtube,
          github: editProfileGithub ? (editProfileGithub.value.trim() || defaultProfile.socialLinks.github) : defaultProfile.socialLinks.github,
          linkedin: editProfileLinkedin ? (editProfileLinkedin.value.trim() || defaultProfile.socialLinks.linkedin) : defaultProfile.socialLinks.linkedin,
          instagram: editProfileInstagram ? (editProfileInstagram.value.trim() || defaultProfile.socialLinks.instagram) : defaultProfile.socialLinks.instagram,
          facebook: editProfileFacebook ? (editProfileFacebook.value.trim() || defaultProfile.socialLinks.facebook) : defaultProfile.socialLinks.facebook,
          whatsapp: editProfileWhatsapp ? (editProfileWhatsapp.value.trim() || defaultProfile.socialLinks.whatsapp) : defaultProfile.socialLinks.whatsapp,
          email: editProfileEmail ? (editProfileEmail.value.trim() || defaultProfile.socialLinks.email) : defaultProfile.socialLinks.email
        }
      };

      // Check if author changed PIN
      const editAuthorPin = document.getElementById('edit-author-pin');
      if (editAuthorPin && editAuthorPin.value.trim()) {
        setAuthorPin(editAuthorPin.value.trim());
        editAuthorPin.value = '';
        showToast('Profile, Links & Author PIN updated successfully!');
      } else {
        showToast('Profile and Social Links saved successfully!');
      }

      saveUserProfile(updated);
      closeProfileModal();
    });
  }

  // Author Authentication & Permissions
  let pendingAuthSuccessCallback = null;
  const authorAuthModal = document.getElementById('author-auth-modal');
  const authorAuthClose = document.getElementById('author-auth-close');
  const authorAuthCancel = document.getElementById('author-auth-cancel');
  const authorAuthForm = document.getElementById('author-auth-form');
  const authorPinInput = document.getElementById('author-pin-input');
  const authorAuthError = document.getElementById('author-auth-error');
  const authorAuthBtn = document.getElementById('author-auth-btn');

  function openAuthorAuthModal(callback = null) {
    pendingAuthSuccessCallback = callback;
    if (authorPinInput) authorPinInput.value = '';
    if (authorAuthError) authorAuthError.style.display = 'none';
    if (authorAuthModal) {
      authorAuthModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { if (authorPinInput) authorPinInput.focus(); }, 150);
    }
  }

  function closeAuthorAuthModal() {
    if (authorAuthModal) {
      authorAuthModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    pendingAuthSuccessCallback = null;
  }

  function updateAuthorStateUI() {
    const isAuth = isAuthorAuthenticated();
    const openCreatorBtn = document.getElementById('open-creator-btn');
    const authorAuthBtn = document.getElementById('author-auth-btn');
    const authorAuthIcon = document.getElementById('author-auth-icon');
    const authorAuthLabel = document.getElementById('author-auth-label');
    const editProfileTrigger = document.getElementById('edit-profile-trigger');
    const editLinksTrigger = document.getElementById('edit-links-trigger');

    if (isAuth) {
      // Author Mode (Aman Kumar)
      if (openCreatorBtn) openCreatorBtn.style.display = 'flex';
      if (authorAuthBtn) {
        authorAuthBtn.classList.add('logged-in');
        authorAuthBtn.title = "Author Mode Active (Click to Logout)";
      }
      if (authorAuthIcon) authorAuthIcon.textContent = '🔓';
      if (authorAuthLabel) authorAuthLabel.textContent = 'Aman (Logout)';
      if (editProfileTrigger) editProfileTrigger.style.display = 'inline-block';
      if (editLinksTrigger) editLinksTrigger.style.display = 'inline-block';
    } else {
      // Reader / Visitor Mode
      if (openCreatorBtn) openCreatorBtn.style.display = 'none';
      if (authorAuthBtn) {
        authorAuthBtn.classList.remove('logged-in');
        authorAuthBtn.title = "Author Access (Aman Kumar Login)";
      }
      if (authorAuthIcon) authorAuthIcon.textContent = '🔐';
      if (authorAuthLabel) authorAuthLabel.textContent = 'Author Login';
      if (editProfileTrigger) editProfileTrigger.style.display = 'none';
      if (editLinksTrigger) editLinksTrigger.style.display = 'none';
    }

    const modalActions = document.getElementById('modal-actions');
    if (modalActions && activeModalPostId) {
      const allPosts = getAllPosts();
      const post = allPosts.find(p => p.id === activeModalPostId);
      if (post && post.isUserCreated && isAuth) {
        modalActions.style.display = 'flex';
      } else {
        modalActions.style.display = 'none';
      }
    }
  }

  if (authorAuthBtn) {
    authorAuthBtn.addEventListener('click', () => {
      if (isAuthorAuthenticated()) {
        if (confirm('Logout from Author Mode? Only you can upload with PIN aman123.')) {
          logoutAuthor();
          showToast('Switched to Visitor Mode.');
        }
      } else {
        openAuthorAuthModal();
      }
    });
  }

  if (authorAuthClose) authorAuthClose.addEventListener('click', closeAuthorAuthModal);
  if (authorAuthCancel) authorAuthCancel.addEventListener('click', closeAuthorAuthModal);
  if (authorAuthModal) {
    authorAuthModal.addEventListener('click', (e) => {
      if (e.target === authorAuthModal) closeAuthorAuthModal();
    });
  }

  if (authorAuthForm) {
    authorAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = authorPinInput.value.trim();
      const success = loginAsAuthor(entered);
      if (success) {
        closeAuthorAuthModal();
        showToast('Welcome back, Aman! Author Mode activated.');
        if (pendingAuthSuccessCallback) {
          const cb = pendingAuthSuccessCallback;
          pendingAuthSuccessCallback = null;
          cb();
        }
      } else {
        authorAuthError.style.display = 'block';
        authorPinInput.focus();
        authorPinInput.select();
      }
    });
  }

  // Nav Tab Links Click Handler
  if (tabLinksLink) {
    tabLinksLink.addEventListener('click', () => {
      openDrawer();
      const linksBox = document.getElementById('links-widget');
      if (linksBox) {
        setTimeout(() => {
          linksBox.scrollIntoView({ behavior: 'smooth' });
          linksBox.style.transition = 'box-shadow 0.3s ease';
          linksBox.style.boxShadow = '0 0 16px rgba(55, 175, 192, 0.6)';
          setTimeout(() => { linksBox.style.boxShadow = ''; }, 1600);
        }, 220);
      }
    });
  }

  // Initial Initialization
  updateProfileUI();
  updateAuthorStateUI();
  renderFeaturedPost();
  renderPostsStream();
  renderArchiveList();

  console.log('Blog successfully initialized with exact Blogger Contempo fonts & Aman Kumar profile.');
});
